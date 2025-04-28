from flask import Flask, render_template, request, send_file, flash, redirect, url_for
import send
from datetime import datetime
import os
import secrets

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", secrets.token_hex(24))

@app.context_processor
def inject_now():
    return {'now': datetime.now()}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/projects/")
def projects():
    return render_template("projects.html")

@app.route("/contact/")
def form():
    return render_template("contact.html")


@app.route("/contacts/", methods=["POST", "GET"])
def contacts():
    if request.method == "GET":
        return render_template("contact.html")
    elif request.method == "POST":
        name = request.form.get("name")
        user_email = request.form.get("email")
        subject = request.form.get("subject", "Portfolio Inquiry")
        message = request.form.get("text")

        # Create message data dictionary for enhanced email
        message_data = {
            'name': name,
            'email': user_email,
            'subject': subject,
            'message': message
        }

        # Send email to yourself (admin) with enhanced HTML formatting
        send.send_email(user_email, message_data)

        # Send confirmation to user with enhanced HTML formatting
        confirmation_message = "Submission was successful!\nThank you for leaving a message."
        send.user_send_email(user_email, confirmation_message, name)

        # Use flash message instead of template variable
        flash("Submission was successful!", "success")

        # Redirect to the contact page to avoid form resubmission
        return redirect(url_for('contacts'))


# Route for downloading the resume
@app.route('/download')
def download_file():
    try:
        # First try the new location
        file_path = 'static/resume.pdf'
        return send_file(file_path, as_attachment=True)
    except FileNotFoundError:
        # Fallback to your original path
        file_path = 'C:\\Users\\Lenovo\\Desktop\\folio\\static\\file\\Maxwell Nyimbili-CS.pdf'
        return send_file(file_path, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True, port=5001)