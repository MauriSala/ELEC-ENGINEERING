# 📧 Configuración de EmailJS para el Formulario de Contacto

## 🚀 Pasos para configurar el envío de emails

### 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Configurar el servicio de email
1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona **"Gmail"** (o tu proveedor de email)
4. Conecta tu cuenta de Gmail (`gerenciaelecsas@gmail.com`)
5. Copia el **Service ID** (ej: `service_xxxxxxx`)

### 3. Crear plantilla de email
1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Usa esta plantilla:

```
Asunto: Nuevo mensaje de contacto - {{from_name}}

Hola,

Has recibido un nuevo mensaje de contacto desde la página web:

Nombre: {{from_name}}
Email: {{from_email}}

Mensaje:
{{message}}

---
Enviado desde ELEC ENGINEERING S.A.S
```

4. Guarda y copia el **Template ID** (ej: `template_xxxxxxx`)

### 4. Obtener la clave pública
1. Ve a **"Account"** → **"General"**
2. Copia tu **Public Key** (ej: `user_xxxxxxxxxxxxxxxx`)

### 5. Actualizar el código
Reemplaza en `script.js` las siguientes líneas:

```javascript
// Línea 75: Reemplazar YOUR_PUBLIC_KEY
emailjs.init("TU_CLAVE_PUBLICA_AQUI");

// Línea 116: Reemplazar YOUR_SERVICE_ID y YOUR_TEMPLATE_ID
emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', templateParams)
```

### 6. Probar el formulario
1. Abre la página web
2. Llena el formulario de contacto
3. Envía el mensaje
4. Verifica que llegue a `gerenciaelecsas@gmail.com`

## ✅ Resultado final
- Los mensajes del formulario llegarán directamente a `gerenciaelecsas@gmail.com`
- Incluirán el nombre, email y mensaje del cliente
- Recibirás una notificación inmediata de nuevos contactos

## 🔧 Alternativas si EmailJS no funciona
1. **Formspree**: [https://formspree.io/](https://formspree.io/)
2. **Netlify Forms**: Si subes el sitio a Netlify
3. **Backend propio**: PHP, Node.js, Python

## 📞 Soporte
Si necesitas ayuda con la configuración, contacta al desarrollador.
