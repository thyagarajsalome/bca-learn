-- ============================================
-- BCALearn Additional Modules - Extended Curriculum
-- ============================================
-- Run this in your Supabase SQL Editor after the initial setup
-- This adds 8 more modules to complement the existing 8
-- ============================================

-- ============================================
-- ADDITIONAL MODULES
-- ============================================

-- Module 9: Mobile App Development
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('Mobile App Development', 'Build native and cross-platform mobile applications using React Native, Flutter, and native development tools.', '📱', '#ff6b6b', 5, 9, true);

-- Module 10: Cloud Computing
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('Cloud Computing', 'Master cloud platforms, services, and deployment strategies for modern applications.', '☁️', '#3498db', 6, 10, true);

-- Module 11: Cyber Security
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('Cyber Security', 'Learn about network security, ethical hacking, cryptography, and security best practices.', '🔒', '#9b59b6', 6, 11, true);

-- Module 12: Artificial Intelligence & Machine Learning
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('Artificial Intelligence & Machine Learning', 'Understand AI concepts, machine learning algorithms, and practical implementation with Python.', '🤖', '#e74c3c', 7, 12, true);

-- Module 13: Software Testing
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('Software Testing', 'Master testing methodologies, automation tools, and quality assurance practices.', '🧪', '#1abc9c', 4, 13, true);

-- Module 14: System Analysis & Design
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('System Analysis & Design', 'Learn system analysis techniques, design methodologies, and documentation practices.', '📊', '#f39c12', 3, 14, true);

-- Module 15: E-Commerce Technologies
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('E-Commerce Technologies', 'Build and manage e-commerce platforms, payment systems, and online business solutions.', '🛒', '#27ae60', 5, 15, true);

-- Module 16: Internet of Things (IoT)
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('Internet of Things (IoT)', 'Understand IoT concepts, sensor networks, and smart device development.', '🌐', '#16a085', 7, 16, true);

-- ============================================
-- LESSONS - Mobile App Development
-- ============================================

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Introduction to Mobile Development', 'Understand mobile app development landscape, platforms, and development approaches.', 'notion', 'https://notion.so/mobile-intro', 1, 45, 0, true
from modules where title = 'Mobile App Development';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'React Native Fundamentals', 'Learn React Native basics, components, and cross-platform development.', 'pdf', 'https://example.com/react-native-basics.pdf', 2, 90, 25, true
from modules where title = 'Mobile App Development';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Mobile UI/UX Design', 'Master mobile interface design principles and user experience best practices.', 'video', 'https://youtube.com/watch?v=mobile-ui', 3, 75, 0, true
from modules where title = 'Mobile App Development';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Flutter Development', 'Build beautiful mobile apps with Flutter and Dart programming language.', 'pdf', 'https://example.com/flutter-guide.pdf', 4, 105, 30, true
from modules where title = 'Mobile App Development';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'App Deployment & Publishing', 'Learn to build, test, and publish mobile apps to app stores.', 'notion', 'https://notion.so/app-deployment', 5, 60, 0, true
from modules where title = 'Mobile App Development';

-- ============================================
-- LESSONS - Cloud Computing
-- ============================================

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Cloud Computing Fundamentals', 'Understand cloud concepts, service models, and deployment strategies.', 'pdf', 'https://example.com/cloud-intro.pdf', 1, 60, 18, true
from modules where title = 'Cloud Computing';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'AWS Services Overview', 'Master Amazon Web Services core services and architecture.', 'video', 'https://youtube.com/watch?v=aws-services', 2, 90, 0, true
from modules where title = 'Cloud Computing';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Azure Cloud Platform', 'Learn Microsoft Azure services and cloud solutions.', 'notion', 'https://notion.so/azure-guide', 3, 75, 0, true
from modules where title = 'Cloud Computing';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Google Cloud Platform', 'Understand GCP services and cloud-native development.', 'pdf', 'https://example.com/gcp-guide.pdf', 4, 90, 22, true
from modules where title = 'Cloud Computing';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Cloud Security & Compliance', 'Learn cloud security best practices and compliance requirements.', 'pdf', 'https://example.com/cloud-security.pdf', 5, 60, 16, true
from modules where title = 'Cloud Computing';

-- ============================================
-- LESSONS - Cyber Security
-- ============================================

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Introduction to Cyber Security', 'Understand cyber security landscape, threats, and defense strategies.', 'pdf', 'https://example.com/cyber-intro.pdf', 1, 60, 20, true
from modules where title = 'Cyber Security';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Network Security', 'Master network security concepts, firewalls, and intrusion detection.', 'notion', 'https://notion.so/network-security', 2, 75, 0, true
from modules where title = 'Cyber Security';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Ethical Hacking Basics', 'Learn penetration testing methodologies and ethical hacking practices.', 'video', 'https://youtube.com/watch?v=ethical-hacking', 3, 90, 0, true
from modules where title = 'Cyber Security';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Cryptography Fundamentals', 'Understand encryption, hashing, and cryptographic protocols.', 'pdf', 'https://example.com/cryptography.pdf', 4, 90, 24, true
from modules where title = 'Cyber Security';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Security Auditing & Compliance', 'Learn security assessment techniques and regulatory compliance.', 'pdf', 'https://example.com/security-audit.pdf', 5, 75, 18, true
from modules where title = 'Cyber Security';

-- ============================================
-- LESSONS - AI & Machine Learning
-- ============================================

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Introduction to AI & ML', 'Understand artificial intelligence concepts and machine learning fundamentals.', 'pdf', 'https://example.com/ai-intro.pdf', 1, 75, 22, true
from modules where title = 'Artificial Intelligence & Machine Learning';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Python for Machine Learning', 'Master Python libraries for ML: NumPy, Pandas, and Scikit-learn.', 'video', 'https://youtube.com/watch?v=python-ml', 2, 120, 0, true
from modules where title = 'Artificial Intelligence & Machine Learning';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Supervised Learning Algorithms', 'Learn regression, classification, and supervised learning techniques.', 'notion', 'https://notion.so/supervised-learning', 3, 90, 0, true
from modules where title = 'Artificial Intelligence & Machine Learning';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Unsupervised Learning', 'Master clustering, dimensionality reduction, and unsupervised methods.', 'pdf', 'https://example.com/unsupervised-learning.pdf', 4, 90, 26, true
from modules where title = 'Artificial Intelligence & Machine Learning';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Deep Learning & Neural Networks', 'Understand neural networks, deep learning, and TensorFlow/PyTorch.', 'video', 'https://youtube.com/watch?v=deep-learning', 5, 120, 0, true
from modules where title = 'Artificial Intelligence & Machine Learning';

-- ============================================
-- LESSONS - Software Testing
-- ============================================

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Software Testing Fundamentals', 'Understand testing principles, types, and the testing lifecycle.', 'pdf', 'https://example.com/testing-intro.pdf', 1, 60, 18, true
from modules where title = 'Software Testing';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Unit Testing with JUnit', 'Master unit testing practices and JUnit framework.', 'notion', 'https://notion.so/unit-testing', 2, 75, 0, true
from modules where title = 'Software Testing';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Integration & System Testing', 'Learn integration testing strategies and system testing methodologies.', 'pdf', 'https://example.com/integration-testing.pdf', 3, 90, 24, true
from modules where title = 'Software Testing';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Test Automation with Selenium', 'Master web application testing automation with Selenium.', 'video', 'https://youtube.com/watch?v=selenium', 4, 105, 0, true
from modules where title = 'Software Testing';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Performance Testing', 'Learn load testing, stress testing, and performance optimization.', 'pdf', 'https://example.com/performance-testing.pdf', 5, 75, 20, true
from modules where title = 'Software Testing';

-- ============================================
-- LESSONS - System Analysis & Design
-- ============================================

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Introduction to System Analysis', 'Understand system analysis concepts and the role of system analysts.', 'pdf', 'https://example.com/sa-intro.pdf', 1, 45, 14, true
from modules where title = 'System Analysis & Design';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Requirements Gathering Techniques', 'Master requirements elicitation, analysis, and specification methods.', 'notion', 'https://notion.so/requirements-gathering', 2, 75, 0, true
from modules where title = 'System Analysis & Design';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'System Design Methodologies', 'Learn structured design, object-oriented design, and design patterns.', 'pdf', 'https://example.com/system-design.pdf', 3, 90, 26, true
from modules where title = 'System Analysis & Design';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'UML Modeling', 'Master Unified Modeling Language for system visualization and documentation.', 'video', 'https://youtube.com/watch?v=uml-modeling', 4, 90, 0, true
from modules where title = 'System Analysis & Design';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'System Implementation & Maintenance', 'Learn implementation strategies and system maintenance practices.', 'pdf', 'https://example.com/system-implementation.pdf', 5, 60, 16, true
from modules where title = 'System Analysis & Design';

-- ============================================
-- LESSONS - E-Commerce Technologies
-- ============================================

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'E-Commerce Fundamentals', 'Understand e-commerce business models, platforms, and technologies.', 'pdf', 'https://example.com/ecommerce-intro.pdf', 1, 60, 18, true
from modules where title = 'E-Commerce Technologies';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Building Online Stores', 'Learn to create e-commerce websites with modern frameworks.', 'notion', 'https://notion.so/online-stores', 2, 90, 0, true
from modules where title = 'E-Commerce Technologies';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Payment Gateway Integration', 'Master payment processing, Stripe, PayPal integration and security.', 'video', 'https://youtube.com/watch?v=payment-gateways', 3, 75, 0, true
from modules where title = 'E-Commerce Technologies';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'E-Commerce Security', 'Learn secure transaction handling, fraud prevention, and compliance.', 'pdf', 'https://example.com/ecommerce-security.pdf', 4, 75, 20, true
from modules where title = 'E-Commerce Technologies';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Digital Marketing for E-Commerce', 'Understand SEO, SEM, and marketing strategies for online stores.', 'pdf', 'https://example.com/ecommerce-marketing.pdf', 5, 60, 16, true
from modules where title = 'E-Commerce Technologies';

-- ============================================
-- LESSONS - Internet of Things (IoT)
-- ============================================

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Introduction to IoT', 'Understand IoT concepts, architecture, and applications.', 'pdf', 'https://example.com/iot-intro.pdf', 1, 60, 18, true
from modules where title = 'Internet of Things (IoT)';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'IoT Sensors & Actuators', 'Learn about sensors, actuators, and IoT hardware components.', 'notion', 'https://notion.so/iot-hardware', 2, 75, 0, true
from modules where title = 'Internet of Things (IoT)';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Arduino & Raspberry Pi', 'Master microcontroller programming with Arduino and Raspberry Pi.', 'video', 'https://youtube.com/watch?v=arduino-rpi', 3, 120, 0, true
from modules where title = 'Internet of Things (IoT)';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'IoT Communication Protocols', 'Understand MQTT, CoAP, and IoT communication standards.', 'pdf', 'https://example.com/iot-protocols.pdf', 4, 90, 24, true
from modules where title = 'Internet of Things (IoT)';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'IoT Security & Privacy', 'Learn IoT security challenges and protection strategies.', 'pdf', 'https://example.com/iot-security.pdf', 5, 75, 20, true
from modules where title = 'Internet of Things (IoT)';

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to see all modules with lesson counts:
-- SELECT m.title as module_title, m.semester, COUNT(l.id) as lesson_count
-- FROM modules m
-- LEFT JOIN lessons l ON m.id = l.module_id
-- GROUP BY m.id, m.title, m.semester
-- ORDER BY m.order_index;

-- Total should now show 16 modules with 80+ lessons

-- ============================================
-- END OF ADDITIONAL MODULES
-- ============================================