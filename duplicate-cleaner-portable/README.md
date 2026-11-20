# 🗂️ DuplicateCleaner — Detector y Limpiador de Archivos Duplicados

Una aplicación web moderna, ultrarrápida y **100% privada** para encontrar y eliminar archivos duplicados en unidades internas y externas (SSD, HDD, USB, etc.).

---

## ✨ Características Principales

- 🔒 **100% Privado y Local:** Funciona enteramente en tu navegador. Tus archivos jamás se suben a la nube ni a ningún servidor externo.
- ⚡ **Hash Criptográfico SHA-256:** Detección precisa basada en el contenido real del archivo, no solo en el nombre o tamaño.
- 🗂 **Multi-Carpeta y Unidades Externas:** Agrega múltiples carpetas o discos duros a la vez y cruza duplicados entre ellos.
- 🧪 **Modo Simulación (Dry-Run):** Prueba y revisa qué archivos se eliminarían y cuánto espacio liberarías sin tocar nada real.
- 📊 **Dashboard y Métricas:**
  - Gráfico Donut de duplicados por extensión de archivo.
  - Gráfico de barras de los mayores consumidores de espacio.
  - Histograma de distribución por tamaño.
  - Barra visual de espacio analizado vs. recuperable.
- 📥 **Exportación Profesional:** Descarga reportes completos en formato **CSV** o **JSON**.
- ⚙️ **Filtros Avanzados:**
  - Ignorar carpetas del sistema (`node_modules`, `.git`, `System Volume Information`, etc.).
  - Ignorar archivos ocultos / dotfiles (`.DS_Store`, etc.).
  - Filtrar por tamaño mínimo de archivo.
  - Incluir o excluir extensiones específicas.
- 🌙 **Modo Oscuro / Claro:** Alterna temas con un clic; persistente en `localStorage`.
- 📱 **PWA (Progressive Web App):** Instalable como aplicación de escritorio nativa en Windows/macOS/Linux y utilizable sin conexión.
- ♿ **Accesibilidad:** Diseñado con soporte para lectores de pantalla y navegación por teclado.

---

## 🚀 Cómo Ejecutar la Aplicación (Para Usuarios Finales)

### Opción 1: Ejecutar directamente con el lanzador (Windows)
1. Asegúrate de tener instalado [Node.js](https://nodejs.org) (versión LTS recomendada).
2. Haz **doble clic en `INICIAR.bat`** (o ejecuta `INICIAR.ps1` con PowerShell).
3. Se abrirá automáticamente tu navegador en `http://localhost:3000`.

> **Nota Importante:** Abre la aplicación en **Google Chrome** o **Microsoft Edge**, ya que son los navegadores que soportan la *File System Access API* para escanear y gestionar carpetas locales.

---

### Opción 2: Instalar como App de Escritorio (PWA)
1. Con la app abierta en Chrome o Edge (`http://localhost:3000`).
2. En la barra de direcciones del navegador, haz clic en el ícono **Instalar** (⊕ o ícono de pantalla con flecha).
3. ¡Listo! Tendrás un acceso directo en tu escritorio e inicio de Windows que se abrirá como ventana independiente sin barra de navegador.

---

## 🛠️ Comandos para Desarrolladores

Si deseas modificar el código o compilarlo por tu cuenta:

```bash
# 1. Instalar dependencias
pnpm install  # o npm install

# 2. Servidor de desarrollo con Hot Reload
pnpm dev

# 3. Compilar build de producción optimizado
pnpm build

# 4. Probar build de producción
node server.js
```

---

## 📁 Estructura del Proyecto

```
duplicate-cleaner/
├── dist/                      # Build de producción optimizado listo para servir
├── public/                    # Iconos PWA, SVG y favicons
├── src/
│   ├── components/            # Componentes modulares
│   │   ├── charts/            # Gráficos con Recharts (Donut, Barras, Histograma, SpaceBar)
│   │   ├── ActionLog.jsx      # Bitácora de acciones
│   │   ├── Dashboard.jsx      # Panel de métricas y exportación
│   │   ├── DeleteModal.jsx    # Modal de confirmación (soporta modo simulación)
│   │   ├── DuplicateGroup.jsx # Fila expandible de duplicados
│   │   ├── FilterPanel.jsx    # Configuración de filtros avanzados
│   │   ├── MultiFolderPicker.jsx # Selector de múltiples carpetas
│   │   ├── ScanProgress.jsx   # Barra de progreso en tiempo real
│   │   ├── SimulationBanner.jsx # Switch de modo simulación (dry-run)
│   │   └── StatsBar.jsx       # Tarjetas de estadísticas generales
│   ├── hooks/                 # Hooks de estado
│   │   ├── useDarkMode.js     # Gestión de tema oscuro
│   │   └── useFilters.js      # Gestión de reglas de exclusión
│   ├── utils/                 # Funciones auxiliares
│   │   ├── chartData.js       # Formateo de datos para gráficos
│   │   ├── duplicateEngine.js # Algoritmo de agrupación y cálculo de ahorro
│   │   └── exporter.js        # Exportadores a CSV y JSON
│   ├── workers/               # Web Workers
│   │   └── scanner.worker.js  # Motor de escaneo y SHA-256 en segundo plano
│   ├── App.jsx                # Orquestador principal
│   └── index.css              # Estilos Tailwind CSS
├── INICIAR.bat                # Lanzador automático para Windows
├── INICIAR.ps1                # Lanzador para PowerShell
├── server.js                  # Servidor HTTP local nativo (cero dependencias externas)
└── vite.config.js             # Configuración de Vite, PWA y Code Splitting
```

---

## 🌐 Opciones de Despliegue en la Nube / Web

Dado que la aplicación procesa todo en el cliente, la carpeta `dist/` se puede desplegar instantáneamente y de forma gratuita en:
- **Vercel** (`vercel deploy`)
- **Netlify** (`netlify deploy --dir=dist`)
- **GitHub Pages**
- **Cloudflare Pages**

---

## 📜 Licencia

Código abierto bajo licencia MIT. Úsalo y modifícalo libremente.
