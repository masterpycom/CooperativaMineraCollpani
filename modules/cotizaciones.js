// Módulo: Cotizaciones de minerales
(function() {
    let app = null;
    
    const CotizacionesModule = {
        setApp: (instance) => { app = instance; },
        
        render: () => {
            const container = document.getElementById('cotizacionesContent');
            if (!container) return;
            
            const data = app.data;
            const puedeEditar = app.puedeEditar();
            
            // AHORA CON String.raw - UNA SOLA BARRA
            const html = String.raw`
                <div class="flex-between" style="margin-bottom: 1rem;">
                    <h2><i class="fas fa-chart-simple"></i> Cotizaciones de Minerales</h2>
                    ${puedeEditar ? `
                        <div>
                            <button id="editPreciosBtn" class="btn-small" style="${data.editPrecios ? 'display:none' : ''}">✏️ Editar precios</button>
                            <button id="viewPreciosBtn" class="btn-small secondary" style="${data.editPrecios ? '' : 'display:none'}">👁️ Ver solo</button>
                        </div>
                    ` : ''}
                </div>
                <div class="card">
                    <p><i class="fas fa-info-circle"></i> Precios de referencia internacional (LME)</p>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #64748b;">
                        1. Constantes y Factores:<br>
Tipo de Cambio: 6.86 $\left[ \frac{Bs}{USD} \right]$<br>
Libra a gramo: 453.592 $\left[ \frac{gr}{lb} \right]$<br>
Kilogramo a gramo: 1000 $\left[ \frac{gr}{kg} \right]$<br>
Onza Troy a gramo: 31.103 $\left[ \frac{gr}{ot} \right]$<br>
Qintal a gramo: 46000 $\left[ \frac{gr}{qq} \right]$<br>
Tonelada a gramo: 1000000 $\left[ \frac{gr}{tn} \right]$<br>
Ley del mineral: 0.65 $\left[ \% \right]$ pureza<br>

Mineral en USD: ZINC
$$\text{Cotisacion } = 1.040 \left[ \frac{USD}{L.F.} \right]$$
$$\text{Gramo} = 1.040\left[ \frac{USD}{L.F.} \right]\times\frac{L.F.}{453.592gr} = 0.002\left[\frac{USD}{gr}\right]$$
$$\text{Kilo} = 0.002\left[\frac{USD}{gr}\right] \times \frac{1000gr}{kg} = 2.293\left[ \frac{USD}{kg} \right]$$
$$\text{Quintal} = 0.002\left[\frac{USD}{gr}\right] \times 46000\left[\frac{gr}{qq}\right] = 105.469\left[ \frac{USD}{qq} \right]$$
$$\text{Tonelada} = 0.002\left[\frac{USD}{gr}\right] \times 1000000\left[\frac{gr}{tn}\right] = 2292.808\left[ \frac{USD}{tn} \right]$$

                    </p>
                </div>
                <div id="cotizacionesLista" class="grid-3">
                    ${data.cotizaciones.map(c => String.raw`
                        <div class="cotizacion-card">
                            <h3>${app.escape(c.mineral)}</h3>
                            ${data.editPrecios && puedeEditar ? `
                                <input type="number" id="precio_${c.id}" value="${c.precio}" step="0.01" style="text-align:center; margin:8px 0;">
                                <button onclick="window.app.modules.cotizaciones.actualizar(${c.id})" style="background:#f5b042; color:#1e293b;">Actualizar</button>
                            ` : `
                                <div class="cotizacion-precio">$${c.precio.toLocaleString()}</div>
                                <div>${c.moneda}</div>
                                <div style="margin-top: 5px; font-size: 0.85rem; color: #64748b;">
                                    Simbolismo: $C_{${app.escape(c.mineral).substring(0,2)}} = ${c.precio}$
                                </div>
                            `}
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.innerHTML = html;
            
            if (typeof renderMathInElement === 'function') {
                renderMathInElement(container, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false
                });
            }
            
            if (puedeEditar) {
                document.getElementById('editPreciosBtn')?.addEventListener('click', () => {
                    app.data.editPrecios = true;
                    app.renderAll();
                });
                document.getElementById('viewPreciosBtn')?.addEventListener('click', () => {
                    app.data.editPrecios = false;
                    app.renderAll();
                });
            }
        },
        
        actualizar: (id) => {
            const input = document.getElementById(`precio_${id}`);
            const nuevoPrecio = parseFloat(input.value);
            if (!isNaN(nuevoPrecio)) {
                const c = app.data.cotizaciones.find(c => c.id === id);
                if (c) {
                    c.precio = nuevoPrecio;
                    app.save();
                    app.bitacora("PRECIO", `${c.mineral}: $${nuevoPrecio}`);
                    app.renderAll();
                }
            }
        }
    };
    
    window.CotizacionesModule = CotizacionesModule;
})();