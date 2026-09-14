import psycopg2, json

conn = psycopg2.connect(
    dbname="vinnavardb",
    user="demoappuser",
    password="demoapp123",
    host="localhost",
    port=5432
)
cur = conn.cursor()

cur.execute("SELECT id, name, slug FROM categories ORDER BY id;")
categories = [{"id": r[0], "name": r[1], "slug": r[2]} for r in cur.fetchall()]

cur.execute("SELECT id, name, slug, short_description, category_id FROM products ORDER BY id;")
products = [{"id": r[0], "name": r[1], "slug": r[2], "short_description": r[3], "category_id": r[4]} for r in cur.fetchall()]

with open("/var/www/vinnavar-fullstack/catalog_dump.json", "w", encoding="utf-8") as f:
    json.dump({"categories": categories, "products": products}, f, indent=2, ensure_ascii=False)

print(f"Dumped {len(categories)} categories and {len(products)} products.")
cur.close()
conn.close()
