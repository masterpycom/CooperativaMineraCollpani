(function() {
    let app = null;
    
    const AvanceModule = {
        setApp: (instance) => { app = instance; },
        
        render: () => {
            const container = document.getElementById('avanceContent');
            if (!container) return;
            
            const data = app.data;
            
            // 1. Evitar división por cero (NaN%) si la checklist no tiene elementos
            const totalItems = data.checklist ? data.checklist.length : 0;
            const completedItems = totalItems ? data.checklist.filter(c => c.completed).length : 0;
            const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
            
            const html = `
                <h2><i class="fas fa-tasks"></i> Estado del Trámite</h2>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${pct}%"></div>
                </div>
                <div style="text-align: right; font-weight: bold; margin-top: 4px;">${pct}% completado</div>
                
                <div class="grid-2" style="margin-top: 15px;">
                    <div class="card">
                        <h3><i class="fas fa-clipboard-list"></i> Pasos del Trámite</h3>
                        <ul class="checklist-items" style="list-style: none; padding-left: 0;">
                            ${totalItems > 0 ? data.checklist.map(i => `
                                <li style="margin-bottom: 8px; opacity: ${i.completed ? 0.6 : 1}">
                                    ${i.completed 
                                        ? `<span style="color: #2ecc71; margin-right: 8px;"><i class="fas fa-check-circle"></i></span><s>${app.escape(i.label)}</s>` 
                                        : `<span style="color: #95a5a6; margin-right: 8px;"><i class="far fa-circle"></i></span>${app.escape(i.label)}`
                                    }
                                </li>
                            `).join('') : '<li>No hay pasos definidos.</li>'}
                        </ul>
                    </div>
                    
                    <div class="card">
                        <h3><i class="fas fa-comment-dots"></i> Comunicados oficiales</h3>
                        <div id="comunicadosLista" style="max-height: 300px; overflow-y: auto; margin-bottom: 15px;">
                            ${data.comunicados && data.comunicados.length ? data.comunicados.map(c => `
                                <div class="comunicado" style="border-left: 4px solid #3498db; padding-left: 10px; margin-bottom: 15px;">
                                    <small style="color: #7f8c8d; display: block; margin-bottom: 4px;">
                                        <i class="far fa-clock"></i> ${new Date(c.fecha).toLocaleString()}
                                    </small>
                                    <p style="margin: 0 0 8px 0;">${app.escape(c.texto)}</p>
                                    ${c.img ? `<div style="margin-bottom: 8px;"><img src="${c.img}" style="max-height: 120px; border-radius: 6px; display: block;"></div>` : ''}
                                    <button class="btn-small warning btn-eliminar-comunicado" data-id="${c.id}">
                                        <i class="fas fa-trash-alt"></i> Eliminar
                                    </button>
                                </div>
                            `).join('') : '<p style="color: #7f8c8d; italic">No hay comunicados oficiales registrados.</p>'}
                        </div>
                        
                        <div class="form-group mt-1" style="border-top: 1px solid #eee; padding-top: 15px;">
                            <textarea id="newComentario" placeholder="Escriba un nuevo comunicado oficial..." rows="2" style="width: 100%; box-sizing: border-box; resize: vertical;"></textarea>
                            <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                                <input type="file" id="imgComunicado" accept="image/*" style="font-size: 0.85em;">
                                <button id="addComunicadoBtn" class="mt-1"><i class="fas fa-paper-plane"></i> Publicar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
            
            // 2. Vinculación limpia de Eventos (Evita colisiones en el DOM)
            document.getElementById('addComunicadoBtn')?.addEventListener('click', () => this.agregarComunicado());
            
            // Delegación de eventos para los botones eliminar (adiós al onclick inline viejo)
            container.querySelectorAll('.btn-eliminar-comunicado').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
                    this.eliminar(id);
                });
            });
        },
        
        agregarComunicado: () => {
            const txtInput = document.getElementById('newComentario');
            const fileInput = document.getElementById('imgComunicado');
            
            if (!txtInput) return;
            const texto = txtInput.value;
            const file = fileInput?.files[0];
            
            if (!texto.trim()) {
                alert('Por favor, escriba el contenido del comunicado.');
                return;
            }
            
            const guardar = (imgUrl) => {
                app.data.comunicados.push({
                    id: Date.now(),
                    texto: texto.trim(),
                    img: imgUrl || null,
                    fecha: new Date().toISOString()
                });
                
                // Primero alteramos/limpiamos la UI para evitar problemas si renderAll recrea nodos
                txtInput.value = '';
                if (fileInput) fileInput.value = '';
                
                app.save();
                app.bitacora("COMUNICADO", texto.substring(0, 50));
                app.renderAll();
            };
            
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => guardar(e.target.result);
                reader.onerror = () => {
                    alert('Error al procesar la imagen seleccionada.');
                };
                reader.readAsDataURL(file);
            } else {
                guardar(null);
            }
        },
        
        eliminar: (id) => {
            if (confirm('¿Está seguro de que desea eliminar este comunicado oficial?')) {
                app.data.comunicados = app.data.comunicados.filter(c => c.id !== id);
                app.save();
                app.bitacora("ELIMINAR", `Comunicado ID: ${id}`);
                app.renderAll();
            }
        }
    };
    
    window.AvanceModule = AvanceModule;
})();