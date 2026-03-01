<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome</title></head>
<body style="font-family:sans-serif;padding:20px;">
<h1>Welcome to Aurum Node</h1>
<p>Hi {{ $user->name }},</p>
<p>Your account has been created. You can now log in and explore the dashboard.</p>
<p><a href="{{ url('/login') }}">Log in</a></p>
</body>
</html>
