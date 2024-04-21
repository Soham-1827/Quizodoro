from flask import Flask, render_template, request, redirect, url_for, session
import os
from file_processing import extract_text
from quiz_generation import generate_questions
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route('/')
@app.route('/pomodoro', methods=['GET', 'POST'])
def pomodoro_timer():
    if request.method == 'POST':
        session['duration'] = int(request.form['duration']) * 60
        return redirect(url_for('upload'))
    return render_template('/pomodoro_timer.html')

@app.route('/upload', methods=['POST'])
def upload():
    f = request.files['file']
    file = secure_filename(f.filename)
    f.save(file)
    if file == '':
        return "No file selected"
    text = extract_text(file)
    if text is None:
        return "Error extracting text from file"
    questions = generate_questions(text)
    # Pass individual attributes of each question to the template
    return render_template('/quiz.html', questions=questions)

@app.route('/quiz')
def quiz():
    questions = session.pop('questions', None)
    return render_template('/quiz.html', questions=questions)

if __name__ == '__main__':
    app.run(debug=True)
