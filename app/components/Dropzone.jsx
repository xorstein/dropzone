'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid'


const Dropzone = ({ className }) => {
  const [files, setFiles] = useState([])
  const [rejected, setRejected] = useState([])

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles(previousFiles => [
        // If allowing multiple files
        // ...previousFiles,
        ...acceptedFiles.map(file =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      ])
    }

    if (rejectedFiles?.length) {
      setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    maxSize: 1024 * 1000,
    maxFiles: 1,
    onDrop
  })

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [files])

  const removeFile = name => {
    setFiles(files => files.filter(file => file.name !== name))
  }

  const removeAll = () => {
    setFiles([])
    setRejected([])
  }

  const removeRejected = name => {
    setRejected(files => files.filter(({ file }) => file.name !== name))
  }

 

  return (
    <form>
      <div
        {...getRootProps({
          className: className
        })}
      >
        <input {...getInputProps({ name: 'file' })} />
        <div className='flex flex-col items-center justify-center gap-4'>
          <ArrowUpTrayIcon className='h-5 w-5 fill-current' />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Faites glisser et déposez les fichiers ici, ou cliquez pour sélectionner des fichiers</p>
          )}
        </div>
      </div>

      {/* Preview */}
      <section className='mt-10'>
        <div className='flex gap-4'>
          <h2 className='title text-3xl font-semibold'>Aperçu</h2>
          <button
            type='button'
            onClick={removeAll}
            className='mt-1 rounded-md border border-rose-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white'
          >
           SUPPRIMER TOUS LES FICHIERS
          </button>
         
        </div>

        {/* Accepted files */}
        <h3 className='title mt-10 border-b pb-3 text-lg font-semibold text-stone-600'>
        Fichiers acceptés
        </h3>
        <ul className='mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
          {files.map(file => (
            <li key={file.name} className='relative h-32 rounded-md shadow-lg'>
              <Image
                src={file.preview}
                alt={file.name}
                width={100}
                height={100}
                onLoad={() => {
                  URL.revokeObjectURL(file.preview)
                }}
                className='h-full w-full rounded-md object-contain'
              />
              <button
                type='button'
                className='absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border border-rose-400 bg-rose-400 transition-colors hover:bg-white'
                onClick={() => removeFile(file.name)}
              >
                <XMarkIcon className='h-5 w-5 fill-white transition-colors hover:fill-rose-400' />
              </button>
              <p className='mt-2 text-[12px] font-medium text-stone-500'>
                {file.name}
              </p>
            </li>
          ))}
        </ul>

        {/* Rejected Files */}
        <h3 className='title mt-24 border-b pb-3 text-lg font-semibold text-stone-600'>
        Fichiers rejetés
        </h3>
        <ul className='mt-6 flex flex-col'>
          {rejected.map(({ file, errors }) => (
            <li key={file.name} className='flex items-start justify-between'>
              <div>
                <p className='mt-2 text-sm font-medium text-stone-500'>
                  {file.name}
                </p>
                <ul className='text-[12px] text-red-400'>
                  {errors.map(error => (
                    <li key={error.code}>{error.message}</li>
                  ))}
                </ul>
              </div>
              <button
                type='button'
                className='mt-1 rounded-md border border-rose-400 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white'
                onClick={() => removeRejected(file.name)}
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </form>
  )
}

export default Dropzone
