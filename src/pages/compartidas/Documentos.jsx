import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useNotificaciones } from '../../context/NotificacionesContext'
import {
  Upload, FileText, Download, Trash2, Search,
  File, FileImage, FileArchive, CheckCircle2, X
} from 'lucide-react'

const CATEGORIAS = ['Todos', 'Legal y Societario', 'Obra y Técnico', 'Económico y Pagos', 'Laboral y Contable', 'Comunicaciones']

const CAT_BADGE = {
  'Legal y Societario': 'blue',
  'Obra y Técnico': 'green',
  'Económico y Pagos': 'purple',
  'Laboral y Contable': 'yellow',
  'Comunicaciones': 'default',
}

const DOCS_INIT = [
  { id: 1, nombre: 'Escritura del terreno.pdf', categoria: 'Legal y Societario', tamaño: '1.8 MB', fecha: '2024-01-20', subidoPor: 'Estudio', tipo: 'pdf' },
  { id: 2, nombre: 'Plano de obra aprobado.pdf', categoria: 'Obra y Técnico', tamaño: '4.2 MB', fecha: '2024-03-15', subidoPor: 'Desarrollos Norte SA', tipo: 'pdf' },
  { id: 3, nombre: 'Habilitación municipal.pdf', categoria: 'Legal y Societario', tamaño: '0.9 MB', fecha: '2024-04-02', subidoPor: 'Estudio', tipo: 'pdf' },
  { id: 4, nombre: 'Certificado de avance Q1 2026.pdf', categoria: 'Económico y Pagos', tamaño: '2.1 MB', fecha: '2026-04-10', subidoPor: 'Constructora Sur SRL', tipo: 'pdf' },
  { id: 5, nombre: 'Nómina personal activo.xlsx', categoria: 'Laboral y Contable', tamaño: '0.4 MB', fecha: '2026-05-01', subidoPor: 'Constructora Sur SRL', tipo: 'archivo' },
  { id: 6, nombre: 'Carta documento Municipio.pdf', categoria: 'Comunicaciones', tamaño: '0.3 MB', fecha: '2026-04-28', subidoPor: 'Estudio', tipo: 'pdf' },
  { id: 7, nombre: 'Foto avance obra mayo.jpg', categoria: 'Obra y Técnico', tamaño: '3.6 MB', fecha: '2026-05-05', subidoPor: 'Constructora Sur SRL', tipo: 'imagen' },
  { id: 8, nombre: 'Liquidación impuestos Q2.pdf', categoria: 'Económico y Pagos', tamaño: '1.1 MB', fecha: '2026-04-30', subidoPor: 'Estudio', tipo: 'pdf' },
  { id: 9, nombre: 'Recibo de sueldo abril.pdf', categoria: 'Laboral y Contable', tamaño: '0.6 MB', fecha: '2026-04-30', subidoPor: 'Constructora Sur SRL', tipo: 'pdf' },
]

function FileTypeIcon({ tipo }) {
  if (tipo === 'imagen') return <FileImage size={16} className="text-emerald-600" />
  if (tipo === 'archivo') return <FileArchive size={16} className="text-orange-600" />
  return <FileText size={16} className="text-blue-600" />
}

function FileTypeBg({ tipo }) {
  if (tipo === 'imagen') return 'bg-emerald-50'
  if (tipo === 'archivo') return 'bg-orange-50'
  return 'bg-blue-50'
}

export default function Documentos() {
  const { agregarActividad } = useNotificaciones()
  const [documentos, setDocumentos] = useState(DOCS_INIT)
  const [filtroCategoria, setFiltroCategoria] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const [catSubida, setCatSubida] = useState('Legal y Societario')
  const [pendingFiles, setPendingFiles] = useState([])

  const onDrop = useCallback(acceptedFiles => {
    if (!acceptedFiles.length) return
    setPendingFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  })

  function confirmarSubida() {
    if (!pendingFiles.length) return
    setUploading(true)
    setTimeout(() => {
      const nuevos = pendingFiles.map((file, i) => {
        const sizeKb = file.size / 1024
        const sizeLabel = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${Math.round(sizeKb)} KB`
        return {
          id: Date.now() + i,
          nombre: file.name,
          categoria: catSubida,
          tamaño: sizeLabel,
          fecha: new Date().toISOString().slice(0, 10),
          subidoPor: 'Estudio',
          tipo: file.type.startsWith('image/') ? 'imagen' : file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? 'archivo' : 'pdf',
        }
      })
      setDocumentos(prev => [...nuevos, ...prev])
      nuevos.forEach(n => {
        agregarActividad({
          tipo: 'documento',
          titulo: 'Documento subido',
          mensaje: `Se subió "${n.nombre}" en categoría ${n.categoria}`,
          cliente: 'Estudio',
        })
      })
      setUploading(false)
      setUploadDone(true)
      setPendingFiles([])
      setTimeout(() => setUploadDone(false), 3000)
    }, 1400)
  }

  function eliminar(id) {
    setDocumentos(prev => prev.filter(d => d.id !== id))
  }

  const docsFiltrados = documentos.filter(d => {
    const matchCat = filtroCategoria === 'Todos' || d.categoria === filtroCategoria
    const matchBusq = d.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return matchCat && matchBusq
  })

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Documentos</h1>
          <p className="text-slate-500 text-sm mt-1">{documentos.length} archivos en total</p>
        </div>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all select-none ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 scale-[1.01]'
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/40'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            <p className="text-sm text-slate-600 font-medium">Subiendo archivos...</p>
          </div>
        ) : uploadDone ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={30} className="text-green-600" />
            </div>
            <p className="text-green-700 font-semibold">¡Archivos subidos correctamente!</p>
          </div>
        ) : isDragActive ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
              <Upload size={28} className="text-blue-600" />
            </div>
            <p className="text-blue-700 font-semibold text-lg">Soltá los archivos aquí</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <Upload size={26} className="text-slate-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 text-base">
                Arrastrá archivos aquí o <span className="text-blue-600 underline underline-offset-2">hacé clic para seleccionar</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOCX, JPG, PNG, XLSX y otros formatos · Sin límite de tipo</p>
            </div>
          </div>
        )}
      </div>

      {/* Pending files para categorizar y confirmar */}
      {pendingFiles.length > 0 && !uploading && !uploadDone && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-700">Archivos listos para subir ({pendingFiles.length})</h3>
              <button onClick={() => setPendingFiles([])} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {pendingFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm bg-slate-50 rounded-lg px-3 py-2">
                  <File size={14} className="text-slate-500 shrink-0" />
                  <span className="text-slate-700 truncate flex-1">{f.name}</span>
                  <span className="text-slate-400 text-xs shrink-0">
                    {f.size > 1024*1024 ? `${(f.size/1024/1024).toFixed(1)} MB` : `${Math.round(f.size/1024)} KB`}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs font-medium text-slate-600">Categoría</label>
                <select
                  value={catSubida}
                  onChange={e => setCatSubida(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIAS.filter(c => c !== 'Todos').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <Button onClick={confirmarSubida} className="mt-5">
                <Upload size={14} /> Confirmar subida
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar archivo..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filtroCategoria === cat ? 'bg-blue-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-700">Archivos</h3>
            <span className="text-sm text-slate-400">{docsFiltrados.length} resultado{docsFiltrados.length !== 1 ? 's' : ''}</span>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Categoría</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Subido por</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {docsFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <File size={36} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-sm text-slate-400">No se encontraron documentos</p>
                  </td>
                </tr>
              ) : (
                docsFiltrados.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 group transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${FileTypeBg({ tipo: d.tipo })}`}>
                          <FileTypeIcon tipo={d.tipo} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{d.nombre}</p>
                          <p className="text-xs text-slate-400">{d.tamaño}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={CAT_BADGE[d.categoria] || 'default'}>{d.categoria}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 text-xs">{d.subidoPor}</td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs">{d.fecha}</td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" title="Descargar">
                          <Download size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-50"
                          title="Eliminar"
                          onClick={() => eliminar(d.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
