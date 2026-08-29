import psycopg2

conn = psycopg2.connect(
    dbname="vinnavardb",
    user="demoappuser",
    password="demoapp123",
    host="localhost",
    port=5432
)
cur = conn.cursor()

descriptions = {
    # Karuppu Kavuni Rice
    2: """Karuppu Kavuni (Black Rice), also renowned as Emperor's Rice, is an ancient heirloom grain treasured across South India and Southeast Asia for its deep purple-black anthocyanin pigments, delightful nutty aroma, and exceptional nutritional profile. Historically cherished by royalty for longevity and vitality, this unpolished whole grain is naturally rich in dietary fiber, plant-based iron, protein, and powerful antioxidants that help combat cellular stress.

It is versatile in traditional culinary preparations, widely used for making delectable Karuppu Kavuni sweet pongal, nutrient-dense breakfast porridge (kanji), idli-dosa batters, puddings, and savory rice bowls.""",

    # Seeraga Samba Rice
    3: """Traditional Seeraga Samba Rice is an aromatic, petite heritage rice variety cherished as the 'King of South Indian Rice.' Named after cumin seeds (seeragam) due to its small, slender grain structure, it imparts an incomparable natural fragrance and delicate taste when cooked. 

It is the authentic, time-honored choice for preparing classic Ambur, Dindigul, and Thalassery biryanis, as well as aromatic ghee rice (Ney Choru) and traditional festive pulao.""",

    # Kerala Vadi Matta Rice
    6: """Organic Kerala Vadi Matta Rice is an authentic, unpolished red parboiled rice variety harvested from the fertile river valleys of Palakkad. Renowned for its distinctive earthy aroma, firm texture, and hearty flavor, it retains the nutrient-dense outer bran and germ layers.

High in magnesium, dietary fiber, and essential minerals, it provides sustained energy release and is the perfect staple accompaniment for traditional South Indian sambar, rasam, and coastal curries.""",

    # HMT Kolam Raw Rice
    12: """HMT Kolam Raw Rice is a premium daily staple grain loved for its slender, lightweight texture, smooth mouthfeel, and pleasant aroma. It cooks into fluffy, separate grains with moderate stickiness, making it ideal for everyday lunch meals, variety rice recipes, curd rice, and lemon rice.""",

    # Karunkuruvai Rice
    15: """Karunkuruvai Rice is a revered traditional medical red-black rice variety mentioned extensively in ancient Siddha medicine. Packed with natural anthocyanins, iron, and minerals, it has been used for centuries to build resilience, enhance immune function, and support vitality in traditional healing therapies.""",

    # Ratthasali Red Rice
    14: """Traditional Ratthasali Rice is a sacred, nutrient-rich red rice variety hailed in Ayurveda for its restorative, blood-nourishing qualities. Light on digestion and packed with micro-nutrients, it is traditionally recommended for convalescing individuals, children, and elderly wellness.""",

    # Thanjai Ponni Parboiled Rice
    31: """Thanjai Ponni Parboiled Rice is sourced from the lush Cauvery delta region of Thanjavur. Parboiled through traditional hygienic methods, it locks in vital nutrients from the paddy husk into the grain, delivering fluffy, non-sticky rice that pairs wonderfully with curries, gravies, and stews.""",

    # Ragi (Finger Millet)
    16: """Ragi (Finger Millet) is an ancient, nutrient-dense super millet loaded with natural calcium, iron, amino acids, and dietary fiber. It is exceptionally beneficial for bone density, diabetic management, and healthy child growth. Ideal for making traditional ragi kali, porridge (kanji), rotis, and dosas.""",

    # Bajra (Pearl Millet)
    17: """Bajra (Pearl Millet) is a hearty, drought-resistant whole millet grain rich in magnesium, phosphorus, and plant protein. It provides enduring strength and warmth, making it popular for rustic rotis, khichdi, and nutritious breakfast porridge.""",

    # Solam (Jowar / Sorghum)
    18: """Solam (Sorghum / Jowar) is a naturally gluten-free ancient grain that supports cardiovascular health and steady digestion. Packed with complex carbohydrates and B-vitamins, it is great for making fluffy rotis, bhakri, and wholesome steamed grain dishes.""",

    # Thinai (Foxtail Millet)
    19: """Thinai (Foxtail Millet) is one of the oldest cultivated millets in Tamil Nadu, traditionally celebrated in Sangam literature. High in vitamin B12, heart-healthy dietary fiber, and minerals, it is superb for preparing delicious upma, sweet payasam, pongal, and pulao.""",

    # Varagu (Kodo Millet)
    20: """Varagu (Kodo Millet) is a fiber-rich, low-glycemic ancient millet that supports healthy weight management and blood sugar regulation. It cooks quickly and serves as an excellent 1:1 wholesome replacement for polished white rice in everyday cooking.""",

    # Saamai (Little Millet)
    21: """Saamai (Little Millet) is a delicate, quick-cooking millet grain rich in magnesium, phosphorus, and polyphenols. Easy to digest and light on the stomach, it makes wonderful idli, crispy dosas, curd bath, and comforting khichdi.""",

    # Kudhiraivali (Barnyard Millet)
    22: """Kudhiraivali (Barnyard Millet) is a wholesome, low-calorie millet with the highest fiber content among grains. It provides steady energy without heaviness, making it a favorite for detox diets, fasting dishes, and diabetic-friendly grain bowls.""",

    # Pani Varagu (Proso Millet)
    23: """Pani Varagu (Proso Millet) is a powerhouse of essential minerals and plant proteins with a low glycemic index. It has a mild, nutty flavor that blends seamlessly into soups, pilafs, breads, and everyday meals.""",

    # Kula Saamai (Brown Top Millet)
    24: """Kula Saamai (Brown Top Millet) is a rare, powerhouse positive millet known for its exceptional dietary fiber content and detoxifying properties. It helps optimize gut health and aids in holistic metabolic balance.""",

    # Sona Masoori Raw Rice
    25: """Sona Masoori Raw Rice is a lightweight, aromatic medium-grain rice prized for its delicate texture and low starch content. Highly digestible and flavorful, it is an everyday South Indian favorite for rasam rice, sambar sadam, and variety rice.""",

    # Thanjai Ponni Raw Rice
    26: """Thanjai Ponni Raw Rice is cultivated in the Cauvery river basin, yielding immaculate white, slender grains that cook soft and tender. A traditional staple across Tamil Nadu households for everyday meals and festival feasts.""",

    # Kichadi Raw Rice
    27: """Kichadi Rice (Deluxe Raw Rice CO51) is a fine-grain traditional variety celebrated for its rich aroma and soft cooking characteristics. Ideal for making authentic South Indian bisibelebath, pongal, and aromatic fried rice.""",

    # Kurunai Broken Raw Rice
    28: """Kurunai Raw Broken Rice consists of clean, premium fragmented grains from unpolished milling. It cooks quickly into creamy, comforting porridges, kozhukattai, upma, and weaning baby foods.""",

    # Sona Masoori Parboiled Rice
    30: """Sona Masoori Parboiled Rice combines the lightness of Sona Masoori with the enhanced nutritional value and firmness of hygienic parboiling. Perfect for daily lunchboxes and wholesome family meals.""",

    # Idli Dosa Batter Rice (Gundu Rice)
    32: """Idli & Dosa Batter Rice (Gundu Rice) features plump, round, short grains specially selected for batter fermentation. It yields incredibly soft, fluffy idlis and golden, crispy dosas with authentic texture and aroma.""",

    # Kurunai Parboiled Broken Rice
    33: """Kurunai Parboiled Broken Rice is wholesome, easy-to-digest broken rice rich in nutrients. Great for quick savory kanji, khichdi, and soft tiffin preparations.""",

    # Deluxe Parboiled CO51 Rice
    34: """Deluxe Parboiled CO51 Rice is a dependable, high-yield grain that cooks into firm, fluffy, separate grains with clean taste and excellent keeping quality throughout the day."""
}

for prod_id, full_desc in descriptions.items():
    cur.execute(
        "UPDATE products SET full_description = %s WHERE id = %s AND (full_description IS NULL OR full_description = '');",
        (full_desc.strip(), prod_id)
    )
    print(f"Updated product ID {prod_id}: {cur.rowcount} row(s) updated.")

conn.commit()
cur.close()
conn.close()
print("All product full descriptions updated successfully!")
