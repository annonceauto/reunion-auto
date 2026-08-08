// Redimensionne et compresse une photo côté navigateur avant l'envoi,
// pour un site plus rapide (moins de données à charger pour tes visiteurs).
export async function compresserPhoto(fichier: File, largeurMax = 1600, qualite = 0.8): Promise<File> {
  if (!fichier.type.startsWith('image/')) return fichier;

  try {
    const image = await Promise.race([
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(fichier);
      }),
      new Promise<HTMLImageElement>((_resolve, reject) =>
        setTimeout(() => reject(new Error('délai dépassé')), 8000)
      ),
    ]);

    const ratio = Math.min(1, largeurMax / image.width);
    const largeur = Math.round(image.width * ratio);
    const hauteur = Math.round(image.height * ratio);

    const canvas = document.createElement('canvas');
    canvas.width = largeur;
    canvas.height = hauteur;
    const contexte = canvas.getContext('2d');
    if (!contexte) return fichier;
    contexte.drawImage(image, 0, 0, largeur, hauteur);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', qualite)
    );
    if (!blob) return fichier;

    return new File([blob], fichier.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
  } catch {
    // Si la compression échoue ou prend trop de temps (photo au format non pris en charge,
    // par exemple), on envoie la photo d'origine plutôt que de bloquer la publication.
    return fichier;
  }
}
