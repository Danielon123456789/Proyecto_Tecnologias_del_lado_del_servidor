// Variables de entorno necesarias antes de cargar cualquier módulo
process.env.MONGO_URI = 'mongodb://localhost:27017/test';
process.env.JWT_SECRET = 'test_secret_key_for_unit_tests';
process.env.SESSION_SECRET = 'test_session_secret';
process.env.FRONTEND_URL = 'http://localhost:4200';
process.env.GOOGLE_CLIENT_ID = 'test_google_client_id';
process.env.GOOGLE_CLIENT_SECRET = 'test_google_client_secret';
process.env.GOOGLE_CALLBACK_URL = 'http://localhost:3000/auth/google/callback';
process.env.STRIPE_SECRET_KEY = 'sk_test_fake_key_for_tests';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_ACCESS_KEY_ID = 'test_access_key';
process.env.AWS_SECRET_ACCESS_KEY = 'test_secret_key';
process.env.AWS_BUCKET_NAME = 'test-bucket';
process.env.AWS_SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:123456789012:test-topic';
process.env.EMAIL_USER = 'test@test.com';
process.env.EMAIL_PASS = 'test_pass';
