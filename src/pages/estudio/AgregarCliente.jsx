import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Card, CardContent } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Upload, FileText, X, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'

export default function AgregarCliente() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [nombre, setNombre] = useState('')
  const [contacto, setContacto] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  function handleFile(e) {
    const file = e.target.files[0]
    if (file) setArchivo(file)
  }

  function removeFile() {
    setArchivo(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function validate() {
    const errs = {}
    if (!nombre.trim()) errs.nombre = 'El nombre es requerido'
    if (!contacto.trim()) errs.contacto = 'El contacto es requerido'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMsg('')
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      let archivo_url = null

      if (archivo) {
        const ext = archivo.name.split('.').pop()
        const path = `${Date.now()}-${nombre.trim().replace(/\s+/g, '_')}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('clientes-archivos')
          .upload(path, archivo)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage
          .from('clientes-archivos')
          .getPublicUrl(path)
        archivo_url = urlData.publicUrl
      }

      // --- DIAGNÓSTICO (eliminar luego) ---
      const { data: sessionData } = await supabase.auth.getSession()
      const session = sessionData?.session
      console.group('🔍 BILDI — diagnóstico insert clientes')
      console.log('session existe:', !!session)
      console.log('user.id:', session?.user?.id ?? 'NULL — no hay sesión activa')
      console.log('role en JWT:', session?.user?.role ?? 'sin role')
      console.log('token (primeros 40 chars):', session?.access_token?.slice(0, 40) ?? 'ninguno')
      console.groupEnd()
      // -------------------------------------

      const { error: insertError } = await supabase
        .from('clientes')
        .insert({ nombre: nombre.trim(), contacto: contacto.trim(), archivo_url })
      if (insertError) {
        console.error('❌ Error insert clientes:', {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
        })
        throw insertError
      }

      setSuccess(true)
      setTimeout(() => navigate('/estudio/clientes'), 2000)
    } catch (err) {
      setErrorMsg(err.message || 'Ocurrió un error al guardar el cliente')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">¡Cliente guardado!</h2>
          <p className="text-slate-500 mt-2 text-sm">Redirigiendo a la lista de clientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/estudio/clientes')}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Agregar cliente</h1>
          <p className="text-slate-500 text-sm mt-0.5">Completá los datos del nuevo cliente</p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {errorMsg}
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nombre"
              type="text"
              placeholder="Nombre del cliente o empresa"
              value={nombre}
              onChange={e => { setNombre(e.target.value); setErrors(p => ({ ...p, nombre: '' })) }}
              error={errors.nombre}
            />

            <Input
              label="Contacto"
              type="text"
              placeholder="Teléfono o email de contacto"
              value={contacto}
              onChange={e => { setContacto(e.target.value); setErrors(p => ({ ...p, contacto: '' })) }}
              error={errors.contacto}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Archivo adjunto{' '}
                <span className="text-slate-400 font-normal">(opcional)</span>
              </label>

              {!archivo ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-lg px-6 py-8 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
                >
                  <Upload size={22} className="text-slate-400" />
                  <p className="text-sm text-slate-500">Hacé clic para seleccionar un archivo</p>
                  <p className="text-xs text-slate-400">Cualquier formato · Un solo archivo</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3 bg-slate-50">
                  <FileText size={18} className="text-blue-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{archivo.name}</p>
                    <p className="text-xs text-slate-400">{(archivo.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 rounded hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFile}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/estudio/clientes')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar cliente'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
