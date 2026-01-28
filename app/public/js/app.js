/**
 * Aplicación Web de Calculadora
 * Maneja la lógica del cliente y comunicación con la API
 */

let operationHistory = [];

// ========================================
// Inicialización
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('✓ Aplicación cargada');
  
  // Verificar salud del servidor
  checkServerHealth();
  setInterval(checkServerHealth, 5000); // Verificar cada 5 segundos
  
  // Cargar historial desde localStorage
  loadHistoryFromStorage();
  
  // Permitir Enter en inputs
  document.getElementById('num1').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculate('add');
  });
  
  document.getElementById('num2').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculate('add');
  });
});

// ========================================
// Verificación de Salud del Servidor
// ========================================
async function checkServerHealth() {
  try {
    const response = await fetch('/health');
    const data = await response.json();
    
    if (data.ok) {
      updateHealthStatus(true);
      updateServerStatus('En línea');
    } else {
      updateHealthStatus(false);
      updateServerStatus('Desconectado');
    }
  } catch (error) {
    console.error('Health check error:', error);
    updateHealthStatus(false);
    updateServerStatus('Error de conexión');
  }
}

function updateHealthStatus(healthy) {
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.querySelector('.status-text');
  
  if (healthy) {
    statusDot.classList.remove('loading', 'unhealthy');
    statusDot.classList.add('healthy');
    statusText.textContent = 'Servidor en línea';
  } else {
    statusDot.classList.remove('loading', 'healthy');
    statusDot.classList.add('unhealthy');
    statusText.textContent = 'Servidor desconectado';
  }
}

function updateServerStatus(status) {
  const serverStatus = document.getElementById('server-status');
  serverStatus.textContent = status;
}

// ========================================
// Cálculos
// ========================================
async function calculate(operation) {
  const num1 = parseFloat(document.getElementById('num1').value);
  const num2 = parseFloat(document.getElementById('num2').value);
  
  // Validación
  if (isNaN(num1) || isNaN(num2)) {
    showError('Por favor, ingresa números válidos');
    return;
  }
  
  if (operation === 'divide' && num2 === 0) {
    showError('No se puede dividir por cero');
    return;
  }
  
  try {
    // Llamar a la API
    const params = new URLSearchParams({
      op: operation,
      a: num1,
      b: num2
    });
    
    const response = await fetch(`/api/calculate?${params}`);
    const data = await response.json();
    
    if (data.error) {
      showError(data.error);
    } else {
      showResult(data, operation, num1, num2);
      addToHistory(operation, num1, num2, data.result);
    }
  } catch (error) {
    console.error('Error:', error);
    showError('Error al comunicarse con el servidor');
  }
}

function showResult(data, operation, a, b) {
  const resultBox = document.getElementById('result-box');
  const resultText = document.getElementById('result-text');
  const resultDetails = document.getElementById('result-details');
  const errorBox = document.getElementById('error-box');
  
  // Ocultar caja de error
  errorBox.classList.add('hidden');
  
  // Mostrar resultado
  const operationSymbol = {
    'add': '+',
    'subtract': '-',
    'multiply': '×',
    'divide': '÷'
  }[operation];
  
  resultText.textContent = `${data.result}`;
  resultDetails.textContent = `${a} ${operationSymbol} ${b} = ${data.result}`;
  
  resultBox.classList.remove('hidden');
}

function showError(message) {
  const errorBox = document.getElementById('error-box');
  const errorText = document.getElementById('error-text');
  const resultBox = document.getElementById('result-box');
  
  // Ocultar caja de resultado
  resultBox.classList.add('hidden');
  
  // Mostrar error
  errorText.textContent = message;
  errorBox.classList.remove('hidden');
  
  console.error('Error:', message);
}

// ========================================
// Historial
// ========================================
function addToHistory(operation, a, b, result) {
  const timestamp = new Date().toLocaleTimeString('es-ES');
  const operationSymbol = {
    'add': '+',
    'subtract': '-',
    'multiply': '×',
    'divide': '÷'
  }[operation];
  
  const entry = {
    operation: operation,
    symbol: operationSymbol,
    a: a,
    b: b,
    result: result,
    timestamp: timestamp
  };
  
  operationHistory.unshift(entry);
  
  // Limitar a 50 operaciones
  if (operationHistory.length > 50) {
    operationHistory.pop();
  }
  
  renderHistory();
  saveHistoryToStorage();
}

function renderHistory() {
  const historyDiv = document.getElementById('history');
  
  if (operationHistory.length === 0) {
    historyDiv.innerHTML = '<p class="empty-message">Sin operaciones aún</p>';
    return;
  }
  
  historyDiv.innerHTML = operationHistory.map((entry, index) => `
    <div class="history-item">
      <strong>${entry.a} ${entry.symbol} ${entry.b}</strong> = <span style="color: var(--secondary-color); font-weight: bold;">${entry.result}</span>
      <div style="font-size: 0.85em; color: var(--text-secondary); margin-top: 5px;">
        ${entry.timestamp}
      </div>
    </div>
  `).join('');
}

function clearHistory() {
  if (confirm('¿Deseas limpiar el historial de operaciones?')) {
    operationHistory = [];
    renderHistory();
    clearHistoryFromStorage();
  }
}

// ========================================
// Almacenamiento Local
// ========================================
function saveHistoryToStorage() {
  try {
    localStorage.setItem('calculatorHistory', JSON.stringify(operationHistory));
  } catch (error) {
    console.warn('No se pudo guardar el historial:', error);
  }
}

function loadHistoryFromStorage() {
  try {
    const stored = localStorage.getItem('calculatorHistory');
    if (stored) {
      operationHistory = JSON.parse(stored);
      renderHistory();
    }
  } catch (error) {
    console.warn('No se pudo cargar el historial:', error);
  }
}

function clearHistoryFromStorage() {
  try {
    localStorage.removeItem('calculatorHistory');
  } catch (error) {
    console.warn('No se pudo limpiar el almacenamiento:', error);
  }
}
