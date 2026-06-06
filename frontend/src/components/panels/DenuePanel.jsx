import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import styles from '../../styles';

export default function DenuePanel({ denueStats, colorMap, visible, onToggleVisible, loading }) {
  const [showChart, setShowChart] = useState(false);

  if (loading) {
    return (
      <div style={styles.panelSection}>
        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: 13 }}>
          Cargando datos DENUE…
        </div>
      </div>
    );
  }

  if (!denueStats) {
    return (
      <div style={styles.panelSection}>
        <div style={{
          padding: '12px', backgroundColor: '#f8fafc', borderRadius: 8,
          fontSize: 12, color: '#64748b', textAlign: 'center', lineHeight: 1.5,
        }}>
          Dibuja un polígono en el mapa y aplica el filtro espacial para ver las unidades económicas DENUE del área.
        </div>
      </div>
    );
  }

  const { total, categories } = denueStats;
  const top = categories[0];
  const chartData = categories.slice(0, 15);

  return (
    <div style={styles.panelSection}>
      {/* Toggle visibilidad de la capa */}
      <button
        onClick={onToggleVisible}
        style={{
          ...styles.primaryBtn,
          width: '100%',
          backgroundColor: visible ? '#0369a1' : '#64748b',
          marginTop: 0,
          marginBottom: 8,
        }}
      >
        {visible ? 'Ocultar capa DENUE' : 'Mostrar capa DENUE'}
      </button>

      <div style={styles.divider} />

      {/* Tarjetas de resumen */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        <div style={styles.measureResultCard}>
          <span style={styles.measureLabel}>Total unidades económicas</span>
          <div style={styles.measureValue}>{total.toLocaleString()}</div>
        </div>

        <div style={styles.measureResultCard}>
          <span style={styles.measureLabel}>Categorías distintas</span>
          <div style={styles.measureValue}>{categories.length}</div>
        </div>

        {top && (
          <div style={{ ...styles.measureResultCard, backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <span style={{ ...styles.measureLabel, color: '#166534' }}>Actividad predominante</span>
            <div style={{ ...styles.measureValue, color: '#166534', fontSize: 11, lineHeight: 1.4 }}>
              {top.nombre_act}
            </div>
            <div style={{ fontSize: 10, color: '#16a34a', marginTop: 3 }}>
              {top.count.toLocaleString()} unidades ({top.percentage}%)
            </div>
          </div>
        )}
      </div>

      {/* Selector Tabla / Gráfico */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {['Tabla', 'Gráfico'].map((label, idx) => {
          const active = idx === 0 ? !showChart : showChart;
          return (
            <button
              key={label}
              onClick={() => setShowChart(idx === 1)}
              style={{
                ...styles.clearBtn,
                flex: 1, marginTop: 0, fontSize: 11,
                backgroundColor: active ? '#9F2241' : '#f8fafc',
                color: active ? '#fff' : '#64748b',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {!showChart ? (
        /* ── Tabla ── */
        <div style={{ maxHeight: 260, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ position: 'sticky', top: 0, backgroundColor: '#f8fafc' }}>
                <th style={thStyle}>Actividad</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>N</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>%</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.nombre_act} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '5px 4px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <span style={{
                        width: 9, height: 9, borderRadius: '50%', marginTop: 2, flexShrink: 0,
                        backgroundColor: colorMap[cat.nombre_act] || '#aaa',
                      }} />
                      <span style={{ color: '#334155', lineHeight: 1.3 }}>{cat.nombre_act}</span>
                    </div>
                  </td>
                  <td style={{ padding: '5px 4px', textAlign: 'right', color: '#475569', fontWeight: 600 }}>
                    {cat.count.toLocaleString()}
                  </td>
                  <td style={{ padding: '5px 4px', textAlign: 'right', color: '#94a3b8' }}>
                    {cat.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ── Gráfico ── */
        <>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 12, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9 }} />
                <YAxis
                  type="category"
                  dataKey="nombre_act"
                  width={110}
                  tick={{ fontSize: 8 }}
                  tickFormatter={(v) => v.length > 20 ? `${v.slice(0, 20)}…` : v}
                />
                <Tooltip
                  formatter={(val) => [val.toLocaleString(), 'Unidades']}
                  labelStyle={{ fontSize: 10, fontWeight: 600 }}
                  contentStyle={{ fontSize: 10 }}
                />
                <Bar dataKey="count" radius={[0, 3, 3, 0]}>
                  {chartData.map((cat) => (
                    <Cell key={cat.nombre_act} fill={colorMap[cat.nombre_act] || '#9F2241'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {categories.length > 15 && (
            <div style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center', marginTop: 4 }}>
              Top 15 de {categories.length} categorías
            </div>
          )}
        </>
      )}
    </div>
  );
}

const thStyle = {
  padding: '6px 4px',
  textAlign: 'left',
  color: '#64748b',
  fontWeight: 600,
  borderBottom: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
};
