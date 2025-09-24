# 🚀 Configuración del Backend en C# para ELEC ENGINEERING

## 📋 Requisitos previos
- **Visual Studio 2022** o **Visual Studio Code**
- **.NET 8.0 SDK** (descargar desde [dotnet.microsoft.com](https://dotnet.microsoft.com/download))
- **Cuenta de Gmail** (`gerenciaelecsas@gmail.com`)

## 🔧 Pasos para configurar el backend

### 1. Configurar Gmail para envío de emails
1. Ve a tu cuenta de Gmail (`gerenciaelecsas@gmail.com`)
2. Ve a **Configuración** → **Seguridad**
3. Activa la **Verificación en 2 pasos**
4. Genera una **Contraseña de aplicación**:
   - Ve a **Contraseñas de aplicaciones**
   - Selecciona **Correo** y **Otro (nombre personalizado)**
   - Escribe "ELEC Engineering API"
   - Copia la contraseña generada (16 caracteres)

### 2. Configurar el proyecto
1. Abre **Visual Studio 2022**
2. Abre la carpeta `Backend/ELECEngineering.API`
3. En `appsettings.json`, reemplaza `TU_APP_PASSWORD_AQUI` con la contraseña de aplicación de Gmail

### 3. Ejecutar el backend
```bash
# En la terminal, navega a la carpeta del proyecto
cd Backend/ELECEngineering.API

# Restaurar paquetes
dotnet restore

# Ejecutar el proyecto
dotnet run
```

### 4. Verificar que funciona
- El backend estará disponible en: `https://localhost:7000`
- Swagger UI estará en: `https://localhost:7000/swagger`
- Endpoint de contacto: `POST https://localhost:7000/api/contact/send`

## 📧 Configuración del email

### Estructura del email que recibirás:
```
Asunto: Nuevo mensaje de contacto - [Nombre del cliente]

Contenido:
- Nombre del cliente
- Email del cliente  
- Mensaje completo
- Fecha y hora
- Diseño profesional con colores de la empresa
```

## 🧪 Probar el sistema completo

### 1. Ejecutar el backend
```bash
cd Backend/ELECEngineering.API
dotnet run
```

### 2. Abrir el frontend
- Abre `index.html` en el navegador
- Llena el formulario de contacto
- Envía el mensaje

### 3. Verificar el email
- Revisa `gerenciaelecsas@gmail.com`
- Deberías recibir el mensaje formateado

## 🔒 Seguridad

### Variables de entorno (Recomendado para producción)
```bash
# En lugar de usar appsettings.json, usa variables de entorno:
export EmailSettings__Username="gerenciaelecsas@gmail.com"
export EmailSettings__Password="tu_app_password"
export EmailSettings__SmtpServer="smtp.gmail.com"
export EmailSettings__SmtpPort="587"
export EmailSettings__UseSsl="true"
```

## 🚀 Despliegue en producción

### Opciones recomendadas:
1. **Azure App Service** - Fácil y escalable
2. **AWS Elastic Beanstalk** - Flexible y potente
3. **DigitalOcean App Platform** - Económico y simple
4. **VPS propio** - Control total

### Configuración para producción:
- Cambiar `https://localhost:7000` por tu dominio
- Usar HTTPS en producción
- Configurar variables de entorno
- Implementar logging y monitoreo

## 📞 Soporte técnico

Si tienes problemas:
1. Verifica que .NET 8.0 esté instalado
2. Confirma que la contraseña de aplicación sea correcta
3. Revisa los logs del backend en la consola
4. Verifica que el puerto 7000 esté disponible

## ✅ Ventajas de esta solución

- **Seguro**: Usa contraseñas de aplicación de Gmail
- **Profesional**: Emails con diseño corporativo
- **Escalable**: Fácil de expandir con más funcionalidades
- **Mantenible**: Código limpio y bien estructurado
- **Confiable**: Usa MailKit, una librería robusta para .NET

