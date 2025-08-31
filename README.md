# FlappyStark 🐦⚡

Un juego de Flappy Bird integrado con StarkNet que permite a los jugadores generar transacciones mientras juegan. Desarrollado con Next.js, TypeScript y Cavos para la autenticación y transacciones en StarkNet.

## 🚀 Características

- **Juego Clásico**: Flappy Bird con mecánicas mejoradas
- **Autenticación Web3**: Registro y login con Cavos
- **Transacciones Automáticas**: Genera transacciones en StarkNet por cada obstáculo superado
- **Sistema de Transacciones**: Diferentes tipos de transacciones según el rendimiento del juego
- **Perfil de Usuario**: Dashboard con estadísticas y transacciones
- **Wallet Automática**: Se crea automáticamente al registrarse

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI
- **Blockchain**: StarkNet, Cavos SDK
- **Autenticación**: Cavos Auth
- **Transacciones**: Cavos Transactions

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta en [Cavos](https://services.cavos.xyz)

## ⚙️ Configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd FlappyStark
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus credenciales de Cavos:

```bash
cp env.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
# Cavos Configuration
NEXT_PUBLIC_CAVOS_APP_ID=tu-app-id-de-cavos
NEXT_PUBLIC_CAVOS_ORG_SECRET=tu-org-secret-de-cavos
NEXT_PUBLIC_CAVOS_NETWORK=mainnet

# Development settings
NODE_ENV=development
```

### 4. Obtener credenciales de Cavos

1. Ve a [Cavos Services](https://services.cavos.xyz)
2. Crea una nueva aplicación
3. Copia el `App ID` y `Organization Secret`
4. Configura la red (mainnet para producción)

## 🎮 Cómo jugar

1. **Registro/Login**: Crea una cuenta o inicia sesión
2. **Seleccionar Personaje**: Elige tu personaje favorito
3. **Jugar**: Haz clic o presiona ESPACIO para volar
4. **Generar Transacciones**: Cada obstáculo superado genera una transacción en StarkNet
5. **Ver Transacciones**: Consulta tu perfil para ver tu historial de transacciones

## 💰 Sistema de Transacciones

- **Score Transaction**: Transacción por cada obstáculo superado
- **Achievement Transaction**: Transacción por logros especiales
- **Reward Transaction**: Transacción al completar el juego

> **Nota**: En esta versión de demostración, las transacciones son simuladas. En producción, se ejecutarían transacciones reales en StarkNet.

## 🔧 Desarrollo

### Ejecutar en desarrollo

```bash
npm run dev
```

### Construir para producción

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js
├── components/            # Componentes React
│   ├── auth/             # Componentes de autenticación
│   └── ui/               # Componentes de UI
├── hooks/                # Hooks personalizados
├── lib/                  # Utilidades y servicios
│   ├── cavos-auth.ts     # Servicio de autenticación Cavos
│   ├── cavos-transactions.ts # Servicio de transacciones
│   └── game-storage.ts   # Almacenamiento del juego
```

## 🔐 Autenticación con Cavos

El proyecto utiliza Cavos para:

- **Registro de usuarios** con wallet automática
- **Login seguro** con tokens JWT
- **Gestión de sesiones** con refresh automático
- **Ejecución de transacciones** en StarkNet

## 💡 Características Técnicas

- **Autenticación Web3**: Sin necesidad de conectar wallet manualmente
- **Transacciones Automáticas**: Se ejecutan automáticamente durante el juego
- **Sincronización**: Las transacciones se sincronizan con la blockchain
- **Persistencia**: Los datos se guardan localmente y en Cavos
- **Responsive**: Diseño adaptativo para móviles y desktop

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard
3. Despliega automáticamente

### Otros proveedores

Asegúrate de configurar las variables de entorno:
- `NEXT_PUBLIC_CAVOS_APP_ID`
- `NEXT_PUBLIC_CAVOS_ORG_SECRET`
- `NEXT_PUBLIC_CAVOS_NETWORK`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas:

1. Verifica que las credenciales de Cavos estén correctas
2. Asegúrate de estar en la red correcta (mainnet)
3. Revisa la consola del navegador para errores
4. Consulta la [documentación de Cavos](https://docs.cavos.xyz)

## 🔗 Enlaces Útiles

- [Cavos Documentation](https://docs.cavos.xyz)
- [StarkNet Documentation](https://docs.starknet.io)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
