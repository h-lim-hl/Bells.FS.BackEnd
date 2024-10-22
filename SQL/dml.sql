use smithy;

INSERT INTO smiths (date_joined, name, prior_experience) VALUES
('2020-01-15', 'John Smith', 5),
('2019-06-20', 'Jane Doe', 10),
('2021-03-10', 'Alice Johnson', 3),
('2022-07-22', 'Bob Brown', 8);

INSERT INTO customers (name, contact, address, email) VALUES
('Mary Williams', '1234567890', '123 Maple St, Springfield', 'mary.williams@example.com'),
('James Wilson', '0987654321', '456 Oak St, Springfield', 'james.wilson@example.com'),
('Linda Davis', '2345678901', '789 Pine St, Springfield', 'linda.davis@example.com'),
('Michael Garcia', '3456789012', '101 Elm St, Springfield', 'michael.garcia@example.com');

INSERT INTO templates (name, base_cost, description) VALUES
('Basic Template', 100.00, 'A simple template for small orders.'),
('Advanced Template', 200.00, 'An advanced template for medium orders.'),
('Premium Template', 300.00, 'A premium template for large orders.');

INSERT INTO materials (name, cubic_cost, description) VALUES
('Wood', 50.00, 'High-quality wood for various applications.'),
('Steel', 75.00, 'Durable steel suitable for heavy-duty use.'),
('Plastic', 30.00, 'Versatile plastic material for light applications.');

INSERT INTO orders (posted, complete_by, smith_id, template_id, material_id, customer_id, completed_at, remarks) VALUES
('2024-10-01 08:00:00', '2024-10-15', 1, 1, 1, 1, NULL, 'First order for testing.'),
('2024-10-02 09:30:00', '2024-10-20', 2, 2, 2, 2, NULL, 'Second order with premium template.'),
('2024-10-03 10:15:00', '2024-10-25', 3, 3, 3, 3, NULL, 'Third order with special materials.'),
('2024-10-04 11:45:00', '2024-10-30', 4, 1, 1, 4, NULL, 'Fourth order with custom requirements.');
