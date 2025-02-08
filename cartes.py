import cv2
import numpy as np
import os

# -----------------------------------------------------------------------------
# CONFIGURATION
# -----------------------------------------------------------------------------

IMAGE_PATH = "mon_image.jpg"   # Chemin vers ta photo qui contient plusieurs cartes
DOSSIER_DEST = "cartes_detectees"  # Sous-dossier pour enregistrer les cartes extraites

# Paramètres pour filtrer les contours
AIRE_MIN = 300     # Aire minimale (en pixels) pour qu'un contour soit considéré
RATIO_MIN = 0.5    # Ratio largeur/hauteur minimal
RATIO_MAX = 2.0    # Ratio largeur/hauteur maximal

# Choix du seuillage : "otsu" ou "adaptatif"
MODE_SEUILLAGE = "adaptatif"

# Paramètres si adaptatif
ADAPTIVE_BLOCK_SIZE = 11
ADAPTIVE_C = 2

INVERSION = True   # Si True, on applique cv2.bitwise_not()


def main():
    # 1) Charger l'image
    image = cv2.imread(IMAGE_PATH)
    if image is None:
        print(f"Impossible de charger l'image : {IMAGE_PATH}")
        return

    # 2) Prétraitement : niveaux de gris + flou
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # 3) Seuillage (adaptatif ou Otsu)
    if MODE_SEUILLAGE.lower() == "otsu":
        _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    else:
        thresh = cv2.adaptiveThreshold(
            blur,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            ADAPTIVE_BLOCK_SIZE,
            ADAPTIVE_C
        )

    # 4) Inversion éventuelle
    if INVERSION:
        thresh = cv2.bitwise_not(thresh)

    # 5) (Optionnel) Opérations morphologiques pour réduire le bruit
    kernel = np.ones((3, 3), np.uint8)
    # Ex. opening pour enlever les petits bruits
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)

    # 6) Détection de tous les contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # 7) Préparer le sous-dossier de destination
    os.makedirs(DOSSIER_DEST, exist_ok=True)

    count_cards = 0

    # 8) Parcourir chaque contour et enregistrer
    for c in contours:
        area = cv2.contourArea(c)
        if area < AIRE_MIN:
            # Trop petit => on ignore
            continue

        # Extraire la bounding box
        x, y, w, h = cv2.boundingRect(c)

        # Vérifier le ratio (largeur / hauteur)
        ratio = float(w) / float(h) if h != 0 else 0
        if ratio < RATIO_MIN or ratio > RATIO_MAX:
            # Ne correspond pas à une carte supposée
            continue

        # On a trouvé un contour "valable" => on l'enregistre
        roi = image[y : y + h, x : x + w]
        count_cards += 1

        # Nom du fichier
        out_filename = f"carte_{count_cards}.jpg"
        out_path = os.path.join(DOSSIER_DEST, out_filename)
        cv2.imwrite(out_path, roi)

        print(f"[OK] Carte #{count_cards} enregistrée : {out_path}")

    print(f"\nTerminé ! {count_cards} cartes détectées et enregistrées dans le dossier '{DOSSIER_DEST}'.")
    

if __name__ == "__main__":
    main()
