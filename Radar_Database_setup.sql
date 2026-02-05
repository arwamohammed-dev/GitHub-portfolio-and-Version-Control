-- تنظيف الجدول من أي محاولات سابقة وتصفير العداد
TRUNCATE TABLE dbo.Users;

-- إدخال القائمة النهائية الخاصة بكِ
INSERT INTO dbo.Users (FirstName, LastName, Email, Phone, Password, AccessType)
VALUES 
('Ruba', 'Alhamaidi', 'ruba.alhumaidi@psd.org.sa', '966-501112223', 'Admin@2024', 'Admin'),
('Arwa', 'Alzeer', 'arwa.alzeer@psd.org.sa', '966-500556440', 'arwaOper!99', 'Operator'),
('Khalid', 'Alenazi', 'Khalid.Alenazi@psd.org.sa', '966-505556667', 'KhUser#123', 'User'),
('Mona', 'Alqahtani', 'Mona.Alqahtani@psd.org.sa', '966-507778889', 'MonaOper*00', 'Operator'),
('Fahad', 'Almalki', 'Fahad.Almalki@psd.org.sa', '966-509990001', 'FahadUsr$88', 'User');

-- عرض النتيجة النهائية للتأكد
SELECT * FROM dbo.Users;
