
import { getDownloadURL, getStorage, ref, StorageReference, uploadBytes, uploadString } from 'firebase/storage'
import { useMessageStore } from '../../stores'
import CONSTANTS from '../../CONSTANTS'


/**
 * Uploads a file to Firebase storage.
 * @param payload - The payload containing file details.
 * @returns The name of the file uploaded.
 */
export const upload = async (payload: {
  extension?: string;
  file: Blob | string;
  mimeType?: string;
  page?: string
}): Promise<string | undefined> => {
  const { extension, file, mimeType, page } = payload
  const storage = getStorage()
  const storageRef: StorageReference = ref(storage, `${crypto.randomUUID()}.${extension}`)

  let fileName: string | undefined
  const metadata = {
    contentType: mimeType,
  }

  if (page === CONSTANTS?.pages?.image) {
    await uploadBytes(storageRef, file as Blob, metadata).then(snapshot => {
      fileName = snapshot.ref.name
    })
  } else if (page === CONSTANTS?.pages?.audio) {
    await uploadString(storageRef, file as string, 'data_url').then(snapshot => {
      fileName = snapshot.ref.name
    })
  }

  return fileName
}

/**
 * Fetches the download URL for a given file from Firebase storage.
 * @param payload - The payload containing the fileName.
 * @returns The download URL of the file.
 */
export const fetchFile = (payload: { fileName: string }): Promise<string> => {
  const { fileName } = payload

  const storage = getStorage()
  const storageRef: StorageReference = ref(storage, fileName)

  return getDownloadURL(storageRef)
    .then(url => url)
    .catch(error => {
      switch (error.code) {
        case 'storage/object-not-found':
          useMessageStore().setError({ error: 'File doesn\'t exist' })
          break
        case 'storage/unauthorized':
          useMessageStore().setError({ error: 'User doesn\'t have permission to access the object' })
          break
        case 'storage/canceled':
          useMessageStore().setError({ error: 'User canceled the upload' })
          break
        case 'storage/unknown':
          useMessageStore().setError({ error: 'Unknown error occurred, inspect the server response' })
          break
      }
      throw error
    })
}
