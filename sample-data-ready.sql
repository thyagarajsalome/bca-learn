-- ============================================
-- BCALearn Sample Data - Ready to Run
-- ============================================
-- Run this in your Supabase SQL Editor after creating the tables
-- ============================================

-- ============================================
-- MODULES - BCA Curriculum
-- ============================================

-- Module 1: Programming Fundamentals
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('Programming Fundamentals', 'Master the basics of programming with C language, including variables, control structures, and functions.', '💻', '#5b6af0', 1, 1, true);

-- Module 2: Data Structures & Algorithms
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('Data Structures & Algorithms', 'Learn essential data structures like arrays, linked lists, trees, and graphs along with fundamental algorithms.', '🔗', '#4ecca3', 2, 2, true);

-- Module 3: Database Management Systems
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('Database Management Systems', 'Understand relational databases, SQL, normalization, and database design principles.', '🗄️', '#f0b15b', 3, 3, true);

-- Module 4: Web Technologies
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('Web Technologies', 'Build modern web applications using HTML, CSS, JavaScript, and popular frameworks.', '🌐', '#ff6b6b', 4, 4, true);

-- Module 5: Operating Systems
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('Operating Systems', 'Learn about process management, memory management, file systems, and OS concepts.', '⚙️', '#9b59b6', 5, 5, true);

-- Module 6: Computer Networks
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('Computer Networks', 'Understand networking concepts, protocols, and communication systems.', '🔌', '#3498db', 6, 6, true);

-- Module 7: Software Engineering
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('Software Engineering', 'Learn software development methodologies, testing, and project management.', '📋', '#1abc9c', 7, 7, true);

-- Module 8: Mathematics for Computing
insert into modules (title, description, icon, color, semester, order_index, is_published) values
('Mathematics for Computing', 'Master discrete mathematics, calculus, and statistics essential for computer science.', '📐', '#e74c3c', 8, 8, true);

-- ============================================
-- LESSONS - Using actual module IDs
-- ============================================

-- Get module IDs dynamically and create lessons
-- This approach uses subqueries to get the correct module IDs

-- Programming Fundamentals Lessons
insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Introduction to C Programming', 'Learn the history of C language, set up your development environment, and write your first program.', 'pdf', 'https://example.com/c-intro.pdf', 1, 45, 12, true
from modules where title = 'Programming Fundamentals';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Variables and Data Types', 'Understand different data types, variable declaration, and memory management in C.', 'pdf', 'https://example.com/c-variables.pdf', 2, 60, 18, true
from modules where title = 'Programming Fundamentals';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Control Structures', 'Master if-else statements, loops, and switch cases for program flow control.', 'pdf', 'https://example.com/c-control.pdf', 3, 75, 22, true
from modules where title = 'Programming Fundamentals';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Functions and Recursion', 'Learn to create reusable functions and understand recursive programming concepts.', 'notion', 'https://notion.so/c-functions', 4, 90, 0, true
from modules where title = 'Programming Fundamentals';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Arrays and Strings', 'Work with arrays and string manipulation in C programming.', 'pdf', 'https://example.com/c-arrays.pdf', 5, 80, 20, true
from modules where title = 'Programming Fundamentals';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Pointers and Memory Management', 'Master pointers, dynamic memory allocation, and memory management in C.', 'video', 'https://youtube.com/watch?v=pointers', 6, 120, 0, true
from modules where title = 'Programming Fundamentals';

-- Data Structures & Algorithms Lessons
insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Introduction to Data Structures', 'Understand what data structures are and why they are important in programming.', 'notion', 'https://notion.so/ds-intro', 1, 30, 0, true
from modules where title = 'Data Structures & Algorithms';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Arrays and Linked Lists', 'Learn the differences between arrays and linked lists, and when to use each.', 'pdf', 'https://example.com/ds-arrays.pdf', 2, 60, 15, true
from modules where title = 'Data Structures & Algorithms';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Stacks and Queues', 'Master stack and queue data structures with practical implementations.', 'pdf', 'https://example.com/ds-stacks.pdf', 3, 75, 18, true
from modules where title = 'Data Structures & Algorithms';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Trees and Binary Search Trees', 'Understand tree data structures and binary search tree operations.', 'video', 'https://youtube.com/watch?v=trees', 4, 90, 0, true
from modules where title = 'Data Structures & Algorithms';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Sorting Algorithms', 'Learn various sorting algorithms: bubble, selection, insertion, merge, and quick sort.', 'pdf', 'https://example.com/algo-sorting.pdf', 5, 120, 25, true
from modules where title = 'Data Structures & Algorithms';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Searching Algorithms', 'Master linear search, binary search, and hash table implementations.', 'notion', 'https://notion.so/algo-searching', 6, 60, 0, true
from modules where title = 'Data Structures & Algorithms';

-- Database Management Systems Lessons
insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Introduction to Databases', 'Learn the basics of databases, DBMS types, and database architecture.', 'pdf', 'https://example.com/db-intro.pdf', 1, 45, 12, true
from modules where title = 'Database Management Systems';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'SQL Fundamentals', 'Master SQL SELECT, INSERT, UPDATE, DELETE operations and basic queries.', 'notion', 'https://notion.so/sql-basics', 2, 60, 0, true
from modules where title = 'Database Management Systems';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Advanced SQL Queries', 'Learn JOINs, subqueries, aggregates, and complex SQL operations.', 'pdf', 'https://example.com/sql-advanced.pdf', 3, 90, 22, true
from modules where title = 'Database Management Systems';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Database Design and Normalization', 'Understand database design principles and normalization forms.', 'video', 'https://youtube.com/watch?v=normalization', 4, 75, 0, true
from modules where title = 'Database Management Systems';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Transactions and Concurrency', 'Learn about ACID properties, transactions, and concurrent access control.', 'pdf', 'https://example.com/db-transactions.pdf', 5, 60, 15, true
from modules where title = 'Database Management Systems';

-- Web Technologies Lessons
insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'HTML Fundamentals', 'Master HTML5 elements, semantic markup, and document structure.', 'notion', 'https://notion.so/html-basics', 1, 45, 0, true
from modules where title = 'Web Technologies';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'CSS Styling and Layout', 'Learn CSS3, Flexbox, Grid, and responsive design principles.', 'pdf', 'https://example.com/css-guide.pdf', 2, 90, 28, true
from modules where title = 'Web Technologies';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'JavaScript Programming', 'Master JavaScript fundamentals, DOM manipulation, and ES6+ features.', 'video', 'https://youtube.com/watch?v=javascript', 3, 120, 0, true
from modules where title = 'Web Technologies';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'React Framework', 'Build modern single-page applications with React components and state management.', 'notion', 'https://notion.so/react-guide', 4, 90, 0, true
from modules where title = 'Web Technologies';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Backend Development with Node.js', 'Create server-side applications with Node.js, Express, and REST APIs.', 'pdf', 'https://example.com/nodejs-guide.pdf', 5, 105, 24, true
from modules where title = 'Web Technologies';

-- Operating Systems Lessons
insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'OS Overview and History', 'Understand operating system evolution, types, and basic concepts.', 'pdf', 'https://example.com/os-intro.pdf', 1, 30, 10, true
from modules where title = 'Operating Systems';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Process Management', 'Learn about processes, threads, scheduling, and process synchronization.', 'notion', 'https://notion.so/os-processes', 2, 75, 0, true
from modules where title = 'Operating Systems';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Memory Management', 'Master memory allocation, virtual memory, paging, and segmentation.', 'pdf', 'https://example.com/os-memory.pdf', 3, 90, 20, true
from modules where title = 'Operating Systems';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'File Systems', 'Understand file system architecture, file operations, and storage management.', 'video', 'https://youtube.com/watch?v=filesystems', 4, 60, 0, true
from modules where title = 'Operating Systems';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Security and Protection', 'Learn about OS security mechanisms, access control, and protection domains.', 'pdf', 'https://example.com/os-security.pdf', 5, 45, 12, true
from modules where title = 'Operating Systems';

-- Computer Networks Lessons
insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Network Fundamentals', 'Understand basic networking concepts, OSI model, and TCP/IP stack.', 'pdf', 'https://example.com/network-intro.pdf', 1, 60, 18, true
from modules where title = 'Computer Networks';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Physical and Data Link Layers', 'Learn about transmission media, MAC addresses, and Ethernet.', 'notion', 'https://notion.so/network-layers', 2, 45, 0, true
from modules where title = 'Computer Networks';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Network Layer and IP', 'Master IP addressing, routing, and network layer protocols.', 'pdf', 'https://example.com/network-ip.pdf', 3, 75, 16, true
from modules where title = 'Computer Networks';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Transport Layer', 'Understand TCP, UDP, port numbers, and transport layer services.', 'video', 'https://youtube.com/watch?v=transport', 4, 60, 0, true
from modules where title = 'Computer Networks';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Application Layer Protocols', 'Learn HTTP, DNS, SMTP, FTP, and other application layer protocols.', 'pdf', 'https://example.com/network-apps.pdf', 5, 90, 22, true
from modules where title = 'Computer Networks';

-- Software Engineering Lessons
insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Introduction to Software Engineering', 'Understand software engineering principles, lifecycle models, and methodologies.', 'pdf', 'https://example.com/se-intro.pdf', 1, 45, 14, true
from modules where title = 'Software Engineering';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Requirements Engineering', 'Learn to gather, analyze, and document software requirements.', 'notion', 'https://notion.so/se-requirements', 2, 60, 0, true
from modules where title = 'Software Engineering';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Software Design Patterns', 'Master common design patterns and principles for better software architecture.', 'pdf', 'https://example.com/se-patterns.pdf', 3, 90, 24, true
from modules where title = 'Software Engineering';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Testing and Quality Assurance', 'Learn testing methodologies, unit testing, integration testing, and QA practices.', 'video', 'https://youtube.com/watch?v=testing', 4, 75, 0, true
from modules where title = 'Software Engineering';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Project Management', 'Understand agile methodologies, Scrum, project planning, and team management.', 'pdf', 'https://example.com/se-project.pdf', 5, 60, 16, true
from modules where title = 'Software Engineering';

-- Mathematics for Computing Lessons
insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Sets and Logic', 'Master set theory, propositional logic, and predicate logic.', 'pdf', 'https://example.com/math-sets.pdf', 1, 60, 18, true
from modules where title = 'Mathematics for Computing';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Functions and Relations', 'Understand mathematical functions, relations, and their properties.', 'notion', 'https://notion.so/math-functions', 2, 45, 0, true
from modules where title = 'Mathematics for Computing';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Combinatorics', 'Learn permutations, combinations, and counting principles.', 'pdf', 'https://example.com/math-combinatorics.pdf', 3, 75, 20, true
from modules where title = 'Mathematics for Computing';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Graph Theory', 'Master graph concepts, paths, cycles, and graph algorithms.', 'video', 'https://youtube.com/watch?v=graphs', 4, 90, 0, true
from modules where title = 'Mathematics for Computing';

insert into lessons (module_id, title, description, type, source_url, order_index, duration_minutes, page_count, is_published)
select id, 'Probability and Statistics', 'Learn probability theory, distributions, and statistical analysis.', 'pdf', 'https://example.com/math-statistics.pdf', 5, 90, 22, true
from modules where title = 'Mathematics for Computing';

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify your data was inserted successfully:
-- SELECT m.title as module_title, COUNT(l.id) as lesson_count
-- FROM modules m
-- LEFT JOIN lessons l ON m.id = l.module_id
-- GROUP BY m.id, m.title
-- ORDER BY m.order_index;

-- ============================================
-- END OF SAMPLE DATA
-- ============================================