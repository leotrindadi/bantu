-- Dados iniciais para teste

-- Inserir quartos de exemplo
INSERT INTO rooms (number, type, status, price, capacity, amenities, description) VALUES
('101', 'single', 'available', 150.00, 1, ARRAY['WiFi', 'TV', 'Ar condicionado'], 'Quarto confortável com vista para o jardim.'),
('102', 'double', 'available', 220.00, 2, ARRAY['WiFi', 'TV', 'Ar condicionado', 'Frigobar'], 'Quarto espaçoso para casal com varanda.'),
('201', 'suite', 'available', 350.00, 3, ARRAY['WiFi', 'TV', 'Ar condicionado', 'Frigobar', 'Banheira'], 'Suíte luxuosa com sala de estar separada.'),
('202', 'deluxe', 'maintenance', 450.00, 4, ARRAY['WiFi', 'TV', 'Ar condicionado', 'Frigobar', 'Banheira', 'Vista para o mar'], 'Quarto deluxe com vista panorâmica para o oceano.'),
('301', 'single', 'available', 150.00, 1, ARRAY['WiFi', 'TV', 'Ar condicionado'], 'Quarto confortável com vista para a cidade.'),
('302', 'double', 'cleaning', 220.00, 2, ARRAY['WiFi', 'TV', 'Ar condicionado', 'Frigobar'], 'Quarto espaçoso para casal.');

-- Inserir consumíveis de exemplo
INSERT INTO consumables (name, category, price, stock, min_stock, unit, description) VALUES
('Água Mineral 500ml', 'bebidas', 5.00, 100, 20, 'un', 'Água mineral natural'),
('Refrigerante Lata 350ml', 'bebidas', 7.00, 80, 15, 'un', 'Refrigerante gelado'),
('Barra de Cereal', 'lanches', 4.50, 50, 10, 'un', 'Barra de cereal integral'),
('Chocolate ao Leite', 'sobremesas', 6.00, 60, 15, 'un', 'Chocolate ao leite 100g'),
('Suco Natural 300ml', 'bebidas', 8.00, 40, 10, 'un', 'Suco natural de frutas'),
('Biscoito Recheado', 'lanches', 5.50, 70, 15, 'un', 'Biscoito recheado'),
('Energético Lata 250ml', 'bebidas', 12.00, 30, 10, 'un', 'Energético'),
('Chips Batata 100g', 'lanches', 9.00, 45, 10, 'un', 'Batata chips');

-- Inserir funcionários de exemplo
INSERT INTO employees (name, email, phone, document, position, department, salary, hire_date, status) VALUES
('Maria Silva', 'maria.silva@hotel.com', '(11) 98765-4321', '123.456.789-00', 'Recepcionista', 'Recepção', 2500.00, '2023-01-15', 'active'),
('João Santos', 'joao.santos@hotel.com', '(11) 98765-4322', '234.567.890-11', 'Gerente', 'Administração', 5000.00, '2022-06-01', 'active'),
('Ana Costa', 'ana.costa@hotel.com', '(11) 98765-4323', '345.678.901-22', 'Camareira', 'Limpeza', 1800.00, '2023-03-20', 'active'),
('Pedro Oliveira', 'pedro.oliveira@hotel.com', '(11) 98765-4324', '456.789.012-33', 'Cozinheiro', 'Cozinha', 3000.00, '2022-11-10', 'active');

-- Inserir hóspedes de exemplo
INSERT INTO guests (name, email, phone, document, nationality, address) VALUES
('Carlos Pereira', 'carlos@example.com', '(11) 99876-5432', '987.654.321-00', 'Brasileiro', 'Rua das Flores, 123, São Paulo - SP'),
('Fernanda Lima', 'fernanda@example.com', '(21) 98765-1234', '876.543.210-99', 'Brasileira', 'Av. Atlântica, 456, Rio de Janeiro - RJ'),
('Roberto Alves', 'roberto@example.com', '(31) 97654-3210', '765.432.109-88', 'Brasileiro', 'Rua Minas, 789, Belo Horizonte - MG');

COMMIT;
