const scriptURL = 'https://script.google.com/macros/s/AKfycbxE4iNmeH3nxYSx20p7U3DurBlm5P_sh8U850vGkSNDb4ckna6zX8lHKuqxV_PVE9BKRw/exec';
const form = document.getElementById('HotelFormulario');
const submitBtn = document.getElementById('submit-btn');
const statusEl = document.getElementById('form-status');

form.addEventListener('submit', e => {
    e.preventDefault();

    // 1. Deshabilitar el botón y mostrar "Enviando"
    submitBtn.disabled = true;
    statusEl.textContent = 'Enviando...';
    statusEl.style.color = '#333';

    // 2. Crear FormData
    const formData = new FormData(form);

    // 3. Obtener y combinar los checkboxes
    const areas = [...form.querySelectorAll('input[name="areaInteres"]:checked')]
        .map(i => i.value);

    // 4. Sobrescribir 'areaInteres' con la cadena combinada
    // Google Sheets recibirá "Turismo, Cocina" en una sola celda.
    formData.set('areaInteres', areas.join(', '));

    // 5. Enviar como FormData (NO como JSON)
    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
        .then(response => {
            // Una respuesta 'ok' es éxito
            if (response.ok) {
                statusEl.textContent = '✅ Información enviada correctamente';
                statusEl.style.color = 'green';
                form.reset(); // Limpiar el formulario
            } else {
                // Si la respuesta no es ok (ej. error de script o red)
                throw new Error('Error en la respuesta del servidor.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            statusEl.textContent = '❌ Error al enviar los datos. Inténtalo de nuevo.';
            statusEl.style.color = 'red';
        })
        .finally(() => {
            // 6. Volver a habilitar el botón
            submitBtn.disabled = false;

            // 7. (Opcional) Borrar el mensaje después de 5 segundos
            setTimeout(() => {
                statusEl.textContent = '';
            }, 5000);
        });
});
