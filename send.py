import smtplib
import ssl
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables

project_folder = '/home/nyimbiliPortfolio/portfolio'
load_dotenv(os.path.join(project_folder, '.env'))

# Get email credentials from environment variables
GMAIL_EMAIL = os.getenv("GMAIL_EMAIL")
GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD")
OUTLOOK_EMAIL = os.getenv("OUTLOOK_EMAIL")
OUTLOOK_PASSWORD = os.getenv("OUTLOOK_PASSWORD")


# SENDING EMAIL TO YOURSELF (ADMIN)
def send_email(username_placeholder, message_data):
    """
    Parameters:
    - username_placeholder: User's email (for backward compatibility)
    - message_data: A dict containing name, email, subject and message
    """
    host = "smtp.gmail.com"
    port = 465
    username = GMAIL_EMAIL
    password = GMAIL_PASSWORD
    receiver = GMAIL_EMAIL

    # Create message container
    msg = MIMEMultipart('related')
    msg['Subject'] = f"Portfolio Inquiry: {message_data['subject']}"
    msg['From'] = username
    msg['To'] = receiver

    # Create the HTML content for the email
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
            body {{
                font-family: 'Segoe UI', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 0;
            }}
            .email-container {{
                border: 1px solid #e1e1e1;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            }}
            .email-header {{
                background: linear-gradient(135deg, #6366F1, #EC4899);
                padding: 20px;
                text-align: center;
            }}
            .logo {{
                max-width: 150px;
                margin-bottom: 10px;
            }}
            .email-content {{
                padding: 30px;
                background: #fff;
            }}
            .email-footer {{
                background: #f9f9f9;
                padding: 15px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #e1e1e1;
            }}
            h1 {{
                color: white;
                margin: 0;
                font-size: 22px;
                font-weight: 600;
            }}
            .field {{
                margin-bottom: 20px;
            }}
            .field-name {{
                font-weight: 600;
                margin-bottom: 5px;
                color: #6366F1;
            }}
            .field-value {{
                background-color: #f9f9f9;
                padding: 12px;
                border-radius: 4px;
                border-left: 3px solid #6366F1;
            }}
            .message-box {{
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 4px;
                border-left: 3px solid #EC4899;
                margin-top: 10px;
                white-space: pre-line;
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <img src="cid:logo" alt="Maxwell Nyimbili" class="logo">
                <h1>New Portfolio Contact</h1>
            </div>
            <div class="email-content">
                <p>You have received a new message from your portfolio website:</p>

                <div class="field">
                    <div class="field-name">Name:</div>
                    <div class="field-value">{message_data['name']}</div>
                </div>

                <div class="field">
                    <div class="field-name">Email:</div>
                    <div class="field-value">{message_data['email']}</div>
                </div>

                <div class="field">
                    <div class="field-name">Subject:</div>
                    <div class="field-value">{message_data['subject']}</div>
                </div>

                <div class="field">
                    <div class="field-name">Message:</div>
                    <div class="message-box">
                        {message_data['message']}
                    </div>
                </div>
            </div>
            <div class="email-footer">
                &copy; {datetime.now().year} Maxwell Nyimbili. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    """

    # Attach HTML part
    msg_html = MIMEText(html, 'html')
    msg.attach(msg_html)

    # Attach logo image
    try:
        # Check both possible paths for the logo
        logo_paths = [
            os.path.join('static', 'images', 'logo.png'),
            os.path.join('static', 'img', 'logo.png')
        ]

        logo_found = False
        for logo_path in logo_paths:
            if os.path.exists(logo_path):
                with open(logo_path, 'rb') as img_file:
                    img = MIMEImage(img_file.read())
                    img.add_header('Content-ID', '<logo>')
                    img.add_header('Content-Disposition', 'inline', filename='logo.png')
                    msg.attach(img)
                    logo_found = True
                    break

        # If logo not found, add a fallback text-only part
        if not logo_found:
            print("Logo file not found. Using fallback text version.")
            # Add plain text alternative
            plain_text = f"""
            New Contact Form Submission

            Name: {message_data['name']}
            Email: {message_data['email']}
            Subject: {message_data['subject']}

            Message:
            {message_data['message']}
            """
            msg_text = MIMEText(plain_text, 'plain')
            msg.attach(msg_text)

    except Exception as e:
        print(f"Error attaching logo: {e}")

    # Send the email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(host, port, context=context) as server:
        server.login(username, password)
        server.sendmail(username, receiver, msg.as_string())


# SEND CONFIRMATION TO USER'S EMAIL
def user_send_email(useremail, message, name=""):
    """
    Send confirmation email to the user with HTML formatting and logo

    Parameters:
    - useremail: User's email address
    - message: Legacy plain text message (not used in HTML version)
    - name: User's name for personalization
    """
    host = "smtp.gmail.com"
    port = 465
    username = GMAIL_EMAIL
    password = GMAIL_PASSWORD
    receiver = useremail

    # Create message container
    msg = MIMEMultipart('related')
    msg['Subject'] = "Thank you for contacting Maxwell Nyimbili"
    msg['From'] = username
    msg['To'] = receiver

    # Create the HTML content for the email
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Your Message</title>
        <style>
            body {{
                font-family: 'Segoe UI', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 0;
            }}
            .email-container {{
                border: 1px solid #e1e1e1;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            }}
            .email-header {{
                background: linear-gradient(135deg, #6366F1, #EC4899);
                padding: 20px;
                text-align: center;
            }}
            .logo {{
                max-width: 150px;
                margin-bottom: 10px;
            }}
            .email-content {{
                padding: 30px;
                background: #fff;
            }}
            .email-footer {{
                background: #f9f9f9;
                padding: 15px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #e1e1e1;
            }}
            h1 {{
                color: white;
                margin: 0;
                font-size: 22px;
                font-weight: 600;
            }}
            h2 {{
                color: #6366F1;
                margin-top: 0;
                font-size: 20px;
            }}
            .message {{
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 4px;
                margin: 20px 0;
            }}
            .social-links {{
                text-align: center;
                margin-top: 20px;
            }}
            .social-links a {{
                display: inline-block;
                margin: 0 10px;
                color: #6366F1;
                text-decoration: none;
            }}
            .button {{
                display: inline-block;
                padding: 10px 20px;
                background: linear-gradient(135deg, #6366F1, #8B5CF6);
                color: white;
                text-decoration: none;
                border-radius: 4px;
                font-weight: 500;
                margin-top: 10px;
                text-align: center;
            }}
            .button:hover {{
                background: linear-gradient(135deg, #4F46E5, #7C3AED);
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <img src="cid:logo" alt="Maxwell Nyimbili" class="logo">
                <h1>Thank You for Your Message</h1>
            </div>
            <div class="email-content">
                <h2>Hello{" " + name if name else ""}!</h2>

                <p>Thank you for reaching out through my portfolio website. I appreciate your interest and will review your message promptly.</p>

                <div class="message">
                    <p><strong>What happens next?</strong></p>
                    <p>I typically respond to all inquiries within 24-48 hours during weekdays. I look forward to connecting with you soon!</p>
                </div>

                <p>In the meantime, feel free to explore more of my projects on my portfolio website or connect with me on social media.</p>

                <div class="social-links">
                    <a href="https://github.com/maxw311nyimbili" target="_blank">GitHub</a>
                    <a href="https://linkedin.com/in/maxwellnyimbili" target="_blank">LinkedIn</a>
                </div>

                <p style="text-align: center; margin-top: 30px;">
                    <a href="https://nyimbiliportfolio.pythonanywhere.com/" class="button">Visit Portfolio</a>
                </p>
            </div>
            <div class="email-footer">
                &copy; {datetime.now().year} Maxwell Nyimbili. All rights reserved.<br>
                <small>This is an automated message, please do not reply directly to this email.</small>
            </div>
        </div>
    </body>
    </html>
    """

    # Attach HTML part
    msg_html = MIMEText(html, 'html')
    msg.attach(msg_html)

    # Attach logo image
    try:
        # Check both possible paths for the logo
        logo_paths = [
            os.path.join('static', 'images', 'logo.png'),
            os.path.join('static', 'img', 'logo.png')
        ]

        logo_found = False
        for logo_path in logo_paths:
            if os.path.exists(logo_path):
                with open(logo_path, 'rb') as img_file:
                    img = MIMEImage(img_file.read())
                    img.add_header('Content-ID', '<logo>')
                    img.add_header('Content-Disposition', 'inline', filename='logo.png')
                    msg.attach(img)
                    logo_found = True
                    break

        # If logo not found, add a fallback text-only part
        if not logo_found:
            print("Logo file not found. Using fallback text version.")
            # Also add plain text alternative
            msg_text = MIMEText(message, 'plain')
            msg.attach(msg_text)

    except Exception as e:
        print(f"Error attaching logo: {e}")
        # Fallback to text version
        msg_text = MIMEText(message, 'plain')
        msg.attach(msg_text)

    # Send the email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(host, port, context=context) as server:
        server.login(username, password)
        server.sendmail(username, receiver, msg.as_string())