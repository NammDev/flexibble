'use client'

import { FormState, ProjectInterface, SessionInterface } from '@/common.types'
import Image from 'next/image'
import React, { ChangeEvent, useState } from 'react'
import FormField from './FormField'

type Props = {
  type: string
  session: SessionInterface
  project?: ProjectInterface
}

const ProjectForm = ({ type, session, project }: Props) => {
  const handleFormSubmit = (e: React.FormEvent) => {}

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {}

  const handleStateChange = (fieldName: keyof FormState, value: string) => {
    setForm((prevForm) => ({ ...prevForm, [fieldName]: value }))
  }

  const [form, setForm] = useState<FormState>({
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    liveSiteUrl: project?.liveSiteUrl || '',
    githubUrl: project?.githubUrl || '',
    category: project?.category || '',
  })

  return (
    <form onSubmit={handleFormSubmit} className='flexStart form'>
      <div className='flexStart form_image-container'>
        <label htmlFor='poster' className='flexCenter form_image-label'>
          {!form?.image && 'Choose a poster for your project'}
        </label>
        <input
          id='image'
          type='file'
          accept='image/*'
          required={type === 'create'}
          className='form_image-input'
          onChange={handleChangeImage}
        />
        {form.image && (
          <Image
            src={form.image}
            className='sm:p-10 object-contain z-20'
            alt='Project poster'
            fill
          />
        )}
      </div>

      <FormField
        title='Title'
        placeholder='Flexibble'
        state={form.title}
        setState={(value) => handleStateChange('title', value)}
      />

      <FormField
        title='Description'
        state={form.description}
        placeholder='Showcase and discover remarkable developer projects.'
        isTextArea
        setState={(value) => handleStateChange('description', value)}
      />

      <FormField
        type='url'
        title='Website URL'
        state={form.liveSiteUrl}
        placeholder='https://jsmastery.pro'
        setState={(value) => handleStateChange('liveSiteUrl', value)}
      />

      <FormField
        type='url'
        title='GitHub URL'
        state={form.githubUrl}
        placeholder='https://github.com/adrianhajdin'
        setState={(value) => handleStateChange('githubUrl', value)}
      />
    </form>
  )
}

export default ProjectForm
