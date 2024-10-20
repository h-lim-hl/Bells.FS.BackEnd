INSERT INTO smiths (date_joined, name, prior_experience) VALUES
('2023-01-15', 'John Smith', 5),
('2023-02-20', 'Jane Doe', 3),
('2023-03-05', 'Bob Johnson', 8),
('2023-04-10', 'Alice Brown', 2);

INSERT INTO customers (name, contact, address, email) VALUES
('Michael Green', '1234567890', '123 Elm St, Springfield, IL', 'michael.green@example.com'),
('Sarah White', '0987654321', '456 Oak St, Springfield, IL', 'sarah.white@example.com'),
('Emily Davis', '5551234567', '789 Maple St, Springfield, IL', 'emily.davis@example.com'),
('David Wilson', '5559876543', '321 Pine St, Springfield, IL', 'david.wilson@example.com');

INSERT INTO templates (name, base_cost, description) VALUES
('Basic Template', 100.00, 'A simple template for basic orders.'),
('Premium Template', 250.00, 'A premium template with advanced features.'),
('Luxury Template', 500.00, 'A luxury template for high-end clients.');

INSERT INTO materials (name, cubic_cost, description) VALUES
('Wood', 30.00, 'High-quality wood for various uses.'),
('Steel', 50.00, 'Durable steel suitable for construction.'),
('Plastic', 10.00, 'Affordable and versatile plastic material.');

INSERT INTO orders (posted, complete_by, smith_id, template_id, material_id, completed_at, remarks) VALUES
('2023-06-01 10:00:00', '2023-06-15', 1, 1, 1, NULL, 'First order for testing.'),
('2023-06-02 11:30:00', '2023-06-20', 2, 2, 2, NULL, 'Urgent order for a client.'),
('2023-06-05 09:45:00', '2023-06-25', 3, 3, 3, NULL, 'Luxury order.'),
('2023-06-10 15:00:00', '2023-06-30', 4, 1, 1, NULL, 'Repeat customer order.');
