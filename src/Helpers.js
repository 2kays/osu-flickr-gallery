
export function buildImageUrl(farmId, serverId, photoId, secret) {
    const urlTemplate = `https://farm${farmId}.staticflickr.com/${serverId}/${photoId}_${secret}.jpg`;
    return urlTemplate;
}
