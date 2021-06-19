import './App.css'
import Upload from './components/Upload'
import { useDropzone } from 'react-dropzone'
import heic2any from 'heic2any'
import { useCallback, useEffect, useState } from 'react'
import Download from './components/Download'

function App() {
  const [blob, setBlob] = useState<Blob | Blob[]>()
  const [image, setImage] = useState<string | undefined>()
  const [name, setName] = useState<string>()

  const onDrop = useCallback(async acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setName(acceptedFiles[0].name)
      const res = await heic2any({
        blob: acceptedFiles[0],
        toType: 'image/jpeg',
        quality: 1,
      })
      setBlob(res)
    }
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  useEffect(() => {
    if (blob) {
      const reader = new FileReader()
      reader.onload = e => {
        setImage(e?.target?.result as string | undefined)
      }
      reader.readAsDataURL(blob as Blob)
    }
  }, [blob])

  return (
    <div className="App">
      {blob ? (
        <Download link={image} name={name?.match(/\w+(?=\.)/)?.join('')} />
      ) : (
        <Upload getInputProps={getInputProps} getRootProps={getRootProps} />
      )}
    </div>
  )
}

export default App
