import clsx from 'clsx'
import { CldUploadButton } from 'next-cloudinary'
import { HiOutlinePhoto } from 'react-icons/hi2'

interface ImagePickerProps {
  label: string
  value?: string | null
  onUpload: (result: any) => void
  shape?: 'round' | 'book' | 'wide'
}

const previewClasses = {
  round: 'h-16 w-16 rounded-full',
  book: 'h-24 w-16 rounded-md',
  wide: 'h-16 w-28 rounded-lg',
}

// Cloudinary upload with a preview; the upload widget is unchanged.
const ImagePicker: React.FC<ImagePickerProps> = ({ label, value, onUpload, shape = 'wide' }) => (
  <div className="flex items-center gap-4 rounded-xl border border-dashed border-line-strong bg-paper p-3">
    <div className={clsx('flex shrink-0 items-center justify-center overflow-hidden bg-sunken text-ink-faint', previewClasses[shape])}>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-full w-full object-cover" />
      ) : (
        <HiOutlinePhoto size={24} />
      )}
    </div>
    <div className="min-w-0">
      <p className="text-sm font-medium text-ink">{label}</p>
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={onUpload}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        className="btn btn-secondary btn-sm mt-1.5"
      >
        {value ? 'Zmeniť obrázok' : 'Nahrať obrázok'}
      </CldUploadButton>
    </div>
  </div>
)

export default ImagePicker
