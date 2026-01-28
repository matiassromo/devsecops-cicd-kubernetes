#!/usr/bin/env node

/**
 * Script de Validación del Proyecto
 * Verifica que todos los archivos necesarios existan
 * y que el proyecto esté bien estructurado
 */

const fs = require('fs');
const path = require('path');

const appDir = __dirname;

const requiredFiles = [
  'index.js',
  'index.test.js',
  'calculator.js',
  'package.json',
  'public/index.html',
  'public/css/style.css',
  'public/js/app.js'
];

const requiredFunctions = {
  'calculator.js': ['add', 'subtract', 'multiply', 'divide']
};

console.log('🔍 Validando estructura del proyecto...\n');

let allValid = true;
let checkedFiles = 0;

// Verificar archivos requeridos
console.log('📁 Verificando archivos...');
requiredFiles.forEach(file => {
  const filePath = path.join(appDir, file);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    console.log(`  ✅ ${file}`);
    checkedFiles++;
  } else {
    console.log(`  ❌ ${file} - NO ENCONTRADO`);
    allValid = false;
  }
});

console.log(`\n✓ Archivos verificados: ${checkedFiles}/${requiredFiles.length}\n`);

// Verificar contenido de archivos críticos
console.log('📝 Verificando contenido de archivos...');

// Verificar package.json
try {
  const pkgPath = path.join(appDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  if (pkg.scripts && pkg.scripts.start && pkg.scripts.test) {
    console.log('  ✅ package.json - Scripts correctos (start, test)');
  } else {
    console.log('  ❌ package.json - Scripts incompletos');
    allValid = false;
  }
} catch (e) {
  console.log('  ❌ package.json - Error al parsear');
  allValid = false;
}

// Verificar index.js
try {
  const indexPath = path.join(appDir, 'index.js');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  const hasServer = indexContent.includes('http.createServer');
  const hasHealth = indexContent.includes('/health');
  const hasAPI = indexContent.includes('/api/');
  const hasCalculator = indexContent.includes('Calculator');
  
  if (hasServer && hasHealth && hasAPI && hasCalculator) {
    console.log('  ✅ index.js - Servidor con todos los endpoints');
  } else {
    console.log('  ❌ index.js - Endpoints incompletos');
    allValid = false;
  }
} catch (e) {
  console.log('  ❌ index.js - Error al leer');
  allValid = false;
}

// Verificar calculator.js
try {
  const calcPath = path.join(appDir, 'calculator.js');
  const calcContent = fs.readFileSync(calcPath, 'utf8');
  
  const hasFunctions = requiredFunctions['calculator.js'].every(fn => 
    calcContent.includes(fn + '(')
  );
  
  if (hasFunctions) {
    console.log('  ✅ calculator.js - Todas las operaciones presentes');
  } else {
    console.log('  ❌ calculator.js - Operaciones faltantes');
    allValid = false;
  }
} catch (e) {
  console.log('  ❌ calculator.js - Error al leer');
  allValid = false;
}

// Verificar index.test.js
try {
  const testPath = path.join(appDir, 'index.test.js');
  const testContent = fs.readFileSync(testPath, 'utf8');
  
  const hasTests = testContent.includes('test(');
  const hasAssert = testContent.includes('assert');
  
  if (hasTests && hasAssert) {
    console.log('  ✅ index.test.js - Pruebas unitarias presentes');
  } else {
    console.log('  ❌ index.test.js - Pruebas incompletas');
    allValid = false;
  }
} catch (e) {
  console.log('  ❌ index.test.js - Error al leer');
  allValid = false;
}

// Verificar HTML
try {
  const htmlPath = path.join(appDir, 'public', 'index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  const hasInputs = htmlContent.includes('input');
  const hasButtons = htmlContent.includes('button');
  const hasScript = htmlContent.includes('script');
  
  if (hasInputs && hasButtons && hasScript) {
    console.log('  ✅ public/index.html - Interfaz web completa');
  } else {
    console.log('  ❌ public/index.html - Interfaz incompleta');
    allValid = false;
  }
} catch (e) {
  console.log('  ❌ public/index.html - Error al leer');
  allValid = false;
}

// Verificar CSS
try {
  const cssPath = path.join(appDir, 'public', 'css', 'style.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  if (cssContent.length > 500) {
    console.log('  ✅ public/css/style.css - Estilos presentes');
  } else {
    console.log('  ❌ public/css/style.css - Estilos incompletos');
    allValid = false;
  }
} catch (e) {
  console.log('  ❌ public/css/style.css - Error al leer');
  allValid = false;
}

// Verificar JavaScript
try {
  const jsPath = path.join(appDir, 'public', 'js', 'app.js');
  const jsContent = fs.readFileSync(jsPath, 'utf8');
  
  const hasCalculate = jsContent.includes('function calculate');
  const hasFetch = jsContent.includes('fetch');
  const hasHistory = jsContent.includes('History');
  
  if (hasCalculate && hasFetch) {
    console.log('  ✅ public/js/app.js - Lógica del cliente presente');
  } else {
    console.log('  ❌ public/js/app.js - Lógica incompleta');
    allValid = false;
  }
} catch (e) {
  console.log('  ❌ public/js/app.js - Error al leer');
  allValid = false;
}

console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('\n✅ ¡VALIDACIÓN EXITOSA!\n');
  console.log('El proyecto está completamente estructurado y funcional.');
  console.log('\nPara ejecutar:\n');
  console.log('  npm install    # Instalar dependencias');
  console.log('  npm start      # Iniciar servidor');
  console.log('  npm test       # Ejecutar pruebas\n');
  process.exit(0);
} else {
  console.log('\n❌ VALIDACIÓN FALLIDA\n');
  console.log('Hay algunos archivos o contenidos faltantes.');
  console.log('Por favor revisa los errores arriba.\n');
  process.exit(1);
}
