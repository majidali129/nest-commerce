import type {
  CloudinaryFolderKey,
  CloudinarySignatureReturnType,
  CloudinaryUploadResult,
} from "@repo/contracts"
import { httpClient } from "../client"
import { toQueryString } from "#lib/query-string"
import axios from "axios"

export const cloudinaryApi = {
  getSignature: (folderName: CloudinaryFolderKey) =>
    httpClient.get<CloudinarySignatureReturnType>(
      `/cloudinary/generate-signature${toQueryString({ folderName })}`,
    ),


  uploadWithSignature: async (
    file: File,
    folderName: CloudinaryFolderKey,
  ): Promise<CloudinaryUploadResult> => {
    const signed = await cloudinaryApi.getSignature(folderName)

    const form = new FormData()
    form.append("file", file)
    form.append("api_key", signed.apiKey)
    form.append("timestamp", String(signed.timestamp))
    form.append("signature", signed.signature)
    form.append("folder", signed.folderName)
    form.append('resource_type', 'auto')
    form.append("invalidate", "true")

    const response = await axios.post(signed.uploadUrl, form, {
      withCredentials: false,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status !== 200) {
      const err = response.data.error?.message ?? "Failed to upload image to Cloudinary"
      throw new Error(err)
    }

    const data = response.data as {
      secure_url?: string
      url?: string
      public_id?: string
    }

    const secureUrl = data.secure_url ?? data.url
    if (!secureUrl || !data.public_id) {
      throw new Error("Cloudinary upload returned an incomplete response")
    }

    return {
      url: data.url ?? secureUrl,
      secureUrl,
      publicId: data.public_id,
    }
  },
}
