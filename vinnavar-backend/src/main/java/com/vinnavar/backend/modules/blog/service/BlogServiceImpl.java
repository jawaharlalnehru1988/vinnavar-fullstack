package com.vinnavar.backend.modules.blog.service;

import com.vinnavar.backend.modules.blog.dto.BlogPostRequest;
import com.vinnavar.backend.modules.blog.dto.BlogPostResponse;
import com.vinnavar.backend.modules.blog.entity.BlogPost;
import com.vinnavar.backend.modules.blog.repository.BlogPostRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final BlogPostRepository repository;

    @PostConstruct
    public void seedInitialBlogs() {
        if (repository.count() == 0 || repository.findAll().stream().anyMatch(b -> b.getContent() == null || b.getContent().length() < 3000)) {
            repository.deleteAll();

            String content1 = """
                    Welcome to the ultimate guide for preparing a silky, comforting, and nutrient-dense Garlic Cream Bucatini with Peas and Asparagus. This dish celebrates the essence of organic cooking by combining farm-fresh spring vegetables with traditional bronze-cut bucatini pasta and a velvety garlic-infused white sauce.

                    ### The Philosophy of Farm-Fresh Organic Cooking
                    At Vinnavar, we believe that exceptional meals start with uncompromised, chemical-free ingredients. When vegetables are grown in nutrient-rich organic soil without synthetic pesticides, their natural flavors shine through effortlessly. Freshly harvested green peas provide a subtle sweet crunch, while tender asparagus spears contribute a delicate earthy aroma.

                    ### Key Organic Ingredients Required:
                    - 400g Organic Bronze-Cut Bucatini Pasta (or Whole Wheat Fettuccine)
                    - 1 Bunch Fresh Farm Asparagus, trimmed and sliced into 2-inch spears
                    - 1.5 Cups Sweet Green Peas (fresh or organic frozen)
                    - 6 Cloves Organic Garlic, finely minced or roasted
                    - 2 Tablespoons Cold-Pressed Extra Virgin Olive Oil
                    - 1 Cup Organic Heavy Cream or Whole Milk (Cashew cream for vegan alternative)
                    - 1/2 Cup Aged Organic Parmesan Cheese, freshly grated
                    - 1 Tablespoon Organic Butter (or cold-pressed coconut butter)
                    - Fresh Organic Basil & Thyme Leaves for garnishing
                    - Sea Salt and Cracked Pink Peppercorns to taste

                    ### Step-by-Step Culinary Preparation Guide:

                    1. **Boil the Pasta to Al Dente Perfection:** Bring a large pot of heavily salted water to a rolling boil. Add the bucatini pasta and cook according to package instructions until al dente (usually 9 to 11 minutes). Reserve 1/2 cup of the starchy pasta cooking water before draining.

                    2. **Sauté the Garlic and Aromatic Base:** Heat the cold-pressed extra virgin olive oil and organic butter in a wide stainless steel skillet over medium heat. Sauté the minced organic garlic for 1 to 2 minutes until soft, golden, and highly fragrant. Avoid burning the garlic to maintain a sweet, delicate profile.

                    3. **Blanch and Sear the Vegetables:** Add the sliced asparagus spears and green peas to the skillet. Gently toss in the garlic oil for 3 to 4 minutes until the asparagus becomes vibrant bright green yet retains a satisfying crisp texture.

                    4. **Simmer the Velvety Cream Sauce:** Pour in the organic cream and bring to a gentle simmer over low heat. Gradually fold in the freshly grated Parmesan cheese, stirring continuously until the sauce becomes smooth, glossy, and slightly thickened.

                    5. **Combine & Emulsify:** Add the cooked bucatini directly into the simmering sauce. Pour in a splash of reserved pasta water to emulsify the sauce, allowing it to coat every strand of pasta evenly. Season with coarse sea salt and cracked pink pepper.

                    6. **Garnish & Serve Fresh:** Transfer to warm pasta bowls, garnish with fresh organic basil leaves, an extra drizzle of cold-pressed olive oil, and serve immediately.

                    ### Nutritional Highlights & Health Benefits:
                    Asparagus is a powerhouse of folate, vitamin K, and essential antioxidants that support cellular health and cardiovascular vitality. Green peas supply plant-based protein, dietary fiber, and essential minerals supporting digestion and sustained physical energy throughout your day.

                    ### Chef Secrets for Culinary Excellence:
                    To elevate this pasta from ordinary to restaurant-quality, ensure you toast your minced garlic on low heat rather than medium-high. Burning garlic introduces bitterness that ruins the creamy dairy base. Additionally, adding a micro-plane grating of fresh lemon zest right before serving balances the rich cream sauce with a refreshing citrus brightness.
                    """;

            String content2 = """
                    Embark on a culinary journey across the Mediterranean with this irresistible recipe for Spicy Harissa Chickpeas with Garlic Whipped Feta. This dish balances bold North African spices with creamy, tangy whipped cheese for a meal that is both rustic and sophisticated.

                    ### Understanding the Magic of Authentic Harissa
                    Harissa is a traditional North African chili pepper paste made from roasted red peppers, baklouti peppers, garlic, cumin, coriander seeds, and organic olive oil. When paired with protein-packed organic chickpeas, it creates a deeply satisfying flavor profile with a pleasant warming spice.

                    ### Ingredients Needed:
                    - 2 Cans (800g total) Organic Cooked Chickpeas, rinsed and drained thoroughly
                    - 2.5 Tablespoons Organic Harissa Paste (adjust to preferred heat level)
                    - 3 Cloves Fresh Organic Garlic, crushed
                    - 3 Tablespoons Cold-Pressed Extra Virgin Olive Oil
                    - 1 Medium Organic Red Onion, diced
                    - 200g Authentic Greek Feta Cheese (made from sheep or goat milk)
                    - 1/3 Cup Organic Greek Yogurt or Cream Cheese
                    - 1 Lemon (juiced and zested)
                    - Fresh Parsley and Mint Leaves for serving
                    - Warm Organic Pita or Sourdough Bread for dipping

                    ### Detailed Preparation Steps:

                    1. **Crafting the Whipped Feta Base:** In a food processor, combine the feta cheese, organic Greek yogurt, 1 tablespoon of olive oil, and 1 teaspoon of fresh lemon juice. Blend on high speed for 2 to 3 minutes until smooth, light, and airy. Spread evenly over the bottom of your serving platter.

                    2. **Crisping the Chickpeas:** Heat the remaining 2 tablespoons of cold-pressed olive oil in a skillet over medium-high heat. Add the diced red onion and sauté for 3 minutes until translucent. Add minced garlic, organic harissa paste, and drained chickpeas.

                    3. **Simmering in Spices:** Stir well to coat every chickpea with the harissa mixture. Reduce heat to medium-low and cook for 8 to 10 minutes, allowing the chickpeas to absorb the rich flavors and turn slightly crispy on the edges.

                    4. **Plating the Dish:** Spoon the warm, spiced chickpeas directly over the cold whipped feta layer. Top with fresh lemon zest, chopped parsley, mint, and a light drizzle of extra virgin olive oil.

                    5. **Serving Suggestion:** Serve immediately with toasted organic sourdough bread or warm artisanal pita pocket bread.

                    ### Wellness & Nutrition Benefits:
                    Organic chickpeas are rich in complex carbohydrates, plant protein, and dietary fiber, promoting blood sugar stability and long-lasting satiety. Feta cheese delivers essential calcium, zinc, and beneficial probiotics for gut health.

                    ### Sourcing Organic Legumes & Storing leftovers:
                    Always opt for organic canned or dried chickpeas to avoid glyphosate residues commonly found in conventionally farmed legumes. Leftover whipped feta and harissa chickpeas can be stored separately in airtight glass containers in the refrigerator for up to 3 days. Reheat the chickpeas gently in a skillet before assembling over fresh cold whipped feta.

                    ### Pairings & Entertaining Ideas:
                    This versatile Mediterranean spread makes a sensational centerpiece for dinner parties and family gatherings. Serve alongside grilled organic vegetables, roasted baby potatoes, or a fresh crisp cucumber and kalamata olive salad. The contrast between warm spiced legumes and cool tangy whipped feta leaves a lasting impression on your guests.
                    """;

            String content3 = """
                    Kickstart your morning with vibrant natural energy! This Almond Butter Banana Smoothie Bowl is packed with raw antioxidants, essential healthy fats, and natural fruit sugars to keep your body energized and your mind sharp throughout the day.

                    ### Why Choose Whole Organic Breakfast Bowls?
                    Commercial breakfast cereals and protein shakes often contain artificial sweeteners, refined sugars, and synthetic preservatives that cause rapid blood sugar spikes followed by mid-morning fatigue. Preparing a fresh smoothie bowl using 100% natural, unrefined organic ingredients provides clean, sustainable fuel without energy crashes.

                    ### Essential Ingredients:
                    - 2 Large Frozen Organic Bananas (sliced before freezing)
                    - 2.5 Tablespoons Pure Raw Almond Butter (100% almonds, zero added palm oil or sugar)
                    - 1/2 Cup Organic Unsweetened Almond Milk, Coconut Water, or Oat Milk
                    - 1 Scoop Organic Plant-Based Vanilla Protein Powder (Optional)
                    - 1/2 Teaspoon Pure Organic Ground Cinnamon or Nutmeg

                    ### Recommended Superfood Toppings:
                    - 1 Tablespoon Organic Chia Seeds or Flaxseed Meal
                    - 2 Tablespoons Organic Toasted Almond Slices or Walnut Chunks
                    - 1/4 Cup Fresh Organic Blueberries, Raspberries, or Strawberries
                    - 1 Tablespoon Organic Cacao Nibs or Unsweetened Coconut Flakes

                    ### Easy Preparation Method:

                    1. **Blend the Base:** Place the frozen organic banana slices, raw almond butter, almond milk, cinnamon, and optional protein powder into a high-speed blender container.

                    2. **Pulse to Thick Sorbet Consistency:** Blend on low to medium speed using the blender tamper to push ingredients toward the blades. Continue blending for 60 to 90 seconds until the mixture becomes thick, creamy, and sorbet-like. Avoid adding excessive liquid to maintain the scoopable texture.

                    3. **Assemble in a Chilled Bowl:** Scoop the thick smoothie mixture into a wide wooden or ceramic bowl. Smooth the top using the back of a spoon.

                    4. **Arrange Toppings Creatively:** Decorate with neat rows of chia seeds, fresh blueberries, almond slices, and cacao nibs for texture and visual elegance.

                    ### Nutrition Profile & Health Impact:
                    Bananas provide high amounts of potassium, manganese, and vitamin B6, while raw almond butter supplies healthy monounsaturated fatty acids that support cardiovascular health. The addition of chia seeds delivers essential omega-3 fatty acids and dietary fiber for optimal digestive wellness.

                    ### Customization & Dietary Modifications:
                    For a nut-free alternative, replace almond butter with organic sunflower seed butter or pumpkin seed butter. You can also boost the greens by blending 1 cup of baby spinach into the banana base without altering the sweet taste profile.

                    ### Environmental Impact of Sourcing Raw Organic Nuts:
                    Choosing certified organic almond butter ensures that no harmful synthetic insecticides or herbicides contaminate local groundwater systems. Organic almond orchards support natural bee pollination ecosystems and promote soil health through traditional cover cropping practices.
                    """;

            String content4 = """
                    Edible oils form the foundational pillar of everyday cooking across the globe. However, the industrial revolution introduced high-heat chemical refining processes that strip oils of their natural healing properties. Discover why traditional wood-pressed (Mara Chekku) and cold-pressed organic oils are essential for a healthy family lifestyle.

                    ### Cold-Pressed vs. Chemically Refined Oils: The Stark Reality
                    Industrial oil refining subjects seeds to temperatures exceeding 230°C (446°F) and utilizes chemical petroleum solvents like hexane for maximum extraction efficiency. This harsh industrial process destroys natural vitamins, changes beneficial unsaturated fats into harmful trans-fats, and requires artificial bleaching and deodorizing agents before bottling.

                    In stark contrast, traditional Cold-Pressing (or Wood-Pressing / Mara Chekku) crushes organic seeds mechanically using heavy wooden pestles at room temperature (below 45°C). No external heat, chemical solvents, or artificial refining agents are ever applied.

                    ### Health Superiority of Cold-Pressed Oils:

                    1. **100% Retention of Vital Antioxidants:** Cold-pressed oils preserve natural Vitamin E, polyphenols, squalene, and phytosterols, which act as powerful anti-inflammatory agents in the human body.

                    2. **Unaltered Essential Fatty Acid Structure:** Because extraction occurs without extreme heat, the natural molecular structure of Essential Fatty Acids (Omega-3, Omega-6, and Omega-9) remains fully intact and bioavailable.

                    3. **Zero Solvents or Chemical Additives:** Cold-pressed oils contain no residual hexane, mineral oils, or synthetic antioxidant preservatives like BHA/BHT.

                    4. **Rich Natural Aroma and Flavor:** Pure wood-pressed sesame, groundnut, and coconut oils retain their authentic natural nutty aroma, elevating the taste and digestibility of every dish prepared.

                    ### Smoke Points & Culinary Application Guide:
                    - **Cold-Pressed Groundnut Oil:** High smoke point (approx. 225°C / 437°F). Ideal for traditional Indian deep frying, roasting, and sautéing.
                    - **Wood-Pressed Sesame (Gingelly) Oil:** Medium-high smoke point. Perfect for traditional South Indian curries, gravies, sambar tempering, and medicinal oil pulling.
                    - **Cold-Pressed Virgin Coconut Oil:** Ideal for raw consumption, baking, light sautéing, hair conditioning, and skin hydration.

                    ### How to Identify Pure Cold-Pressed Oils:
                    Authentic cold-pressed oils are slightly cloudy or viscous compared to water-clear refined oils. They may form a light natural sediment at the bottom of the bottle over time. This sediment is proof of unrefined, raw purity.

                    Making the permanent switch to 100% pure cold-pressed organic oils is one of the single most impactful decisions you can make for long-term cardiovascular health, liver protection, and overall cellular vitality.

                    ### Storage Instructions for Maximum Freshness:
                    Store unrefined cold-pressed oils in dark glass bottles or food-grade stainless steel containers away from direct sunlight and heat sources. When stored properly at room temperature, unrefined oils maintain their fresh aroma and nutritional integrity for 6 to 9 months without oxidative rancidity.
                    """;

            String content5 = """
                    Looking for a quick, delicious, and deeply satisfying lunch or dinner bowl? This 15-Minute Roasted Veggie Quinoa Salad is packed with vibrant colors, complete plant-based protein, and gut-healthy fiber, making it the perfect meal-prep dish for busy weekdays and active lifestyles.

                    ### The Power of Quinoa: An Ancient Supergrain
                    Quinoa is an ancient grain cultivated for thousands of years in South America. Unlike most grains, quinoa is a complete protein source containing all nine essential amino acids that the human body cannot produce on its own. Combined with roasted organic vegetables and a creamy tahini-lemon dressing, this bowl delivers well-rounded, clean nutrition.

                    ### Fresh Organic Ingredients Required:
                    - 1 Cup Organic White, Red, or Tri-Color Quinoa (rinsed well under cold water)
                    - 2 Cups Water or Low-Sodium Organic Vegetable Broth
                    - 1 Medium Organic Zucchini, diced into 1/2-inch cubes
                    - 1 Organic Red Bell Pepper, chopped
                    - 1 Cup Organic Sweet Carrots or Cherry Tomatoes
                    - 2.5 Tablespoons Cold-Pressed Extra Virgin Olive Oil
                    - 1/2 Cup Crumbled Feta Cheese or Toasted Chickpeas (for vegan option)
                    - Fresh Chopped Cilantro or Parsley for garnishing

                    ### Creamy Lemon-Tahini Dressing Ingredients:
                    - 3 Tablespoons Organic Whole Sesame Tahini Paste
                    - 2 Tablespoons Fresh Organic Lemon Juice
                    - 1 Clove Minced Organic Garlic
                    - 2 to 3 Tablespoons Warm Water (to thin to desired consistency)
                    - Sea Salt and Fresh Ground Black Pepper to taste

                    ### Step-by-Step Culinary Preparation Guide:

                    1. **Cook the Quinoa:** Combine rinsed quinoa and vegetable broth in a medium saucepan over high heat. Bring to a rolling boil, reduce heat to low, cover with a tight lid, and simmer for 14 to 15 minutes until all liquid is absorbed and quinoa germs spiral open. Remove from heat, fluff gently with a fork, and let cool for 5 minutes.

                    2. **Roast the Vegetables:** Toss sliced zucchini, bell peppers, and carrots in cold-pressed olive oil, sea salt, and black pepper. Spread evenly on a parchment-lined baking sheet and roast in a preheated oven at 200°C (400°F) for 14 to 16 minutes until caramelized around the edges.

                    3. **Whisk the Tahini Dressing:** In a small glass bowl, combine sesame tahini paste, fresh lemon juice, minced garlic, sea salt, and warm water. Whisk vigorously until the dressing turns pale, smooth, and creamy.

                    4. **Toss & Assemble:** In a large wooden salad bowl, combine cooked quinoa, warm roasted vegetables, and crumbled feta cheese. Drizzle the creamy lemon-tahini dressing over the top and gently toss until evenly coated.

                    ### Meal Prep & Storage Best Practices:
                    This roasted veggie quinoa salad stores remarkably well in airtight glass containers in the refrigerator for up to 4 days without losing its delightful texture or flavor. Enjoy it cold straight from the fridge or warm it gently in a pan.

                    ### Creative Serving Variations & Add-Ins:
                    You can easily customize this base bowl by adding roasted sweet potatoes, steamed edamame beans, or toasted pumpkin seeds for extra crunch. Swap tahini dressing for a zesty lemon herb vinaigrette if you prefer a lighter, tangier finish.
                    """;

            BlogPost b1 = BlogPost.builder()
                    .title("Garlic Cream Bucatini with Peas and Asparagus")
                    .slug("garlic-cream-bucatini-peas-asparagus")
                    .category("Recipes")
                    .shortDescription("A rich and creamy organic pasta dish bursting with fresh garden peas, tender asparagus, and aromatic roasted garlic.")
                    .content(content1)
                    .imageUrl("/media/site/blog-large.jpg")
                    .author("Vinnavar Chef")
                    .readTimeMinutes(6)
                    .featured(true)
                    .active(true)
                    .build();

            BlogPost b2 = BlogPost.builder()
                    .title("Harissa Chickpeas with Whipped Feta")
                    .slug("harissa-chickpeas-whipped-feta")
                    .category("Recipes")
                    .shortDescription("Warm spicy chickpeas served over silky smooth whipped feta cheese with organic olive oil drizzle.")
                    .content(content2)
                    .imageUrl("/media/site/blog-img-1.jpg")
                    .author("Vinnavar Kitchen")
                    .readTimeMinutes(5)
                    .featured(false)
                    .active(true)
                    .build();

            BlogPost b3 = BlogPost.builder()
                    .title("Almond Butter Banana Smoothie Bowl")
                    .slug("almond-butter-banana-smoothie-bowl")
                    .category("Health & Wellness")
                    .shortDescription("Start your morning with raw energy! A creamy smoothie bowl packed with organic bananas, almond butter, and chia seeds.")
                    .content(content3)
                    .imageUrl("/media/site/blog-img-2.jpg")
                    .author("Nutritionist Wellness Team")
                    .readTimeMinutes(4)
                    .featured(false)
                    .active(true)
                    .build();

            BlogPost b4 = BlogPost.builder()
                    .title("Why Cold-Pressed Organic Oils Are Superior for Health")
                    .slug("why-cold-pressed-organic-oils-are-superior")
                    .category("Organic Living")
                    .shortDescription("Learn the science behind traditional cold-pressing and how it preserves vital nutrients, antioxidants, and pure natural aroma.")
                    .content(content4)
                    .imageUrl("/media/site/blog-img-4.jpg")
                    .author("Organic Agriculture Specialist")
                    .readTimeMinutes(7)
                    .featured(false)
                    .active(true)
                    .build();

            BlogPost b5 = BlogPost.builder()
                    .title("Simple 15-Minute Roasted Veggie Quinoa Salad")
                    .slug("simple-roasted-veggie-quinoa-salad")
                    .category("Recipes")
                    .shortDescription("A vibrant salad with roasted carrots, bell peppers, organic quinoa, and zesty lemon-tahini dressing.")
                    .content(content5)
                    .imageUrl("/media/site/blog-img-5.jpg")
                    .author("Vinnavar Chef")
                    .readTimeMinutes(5)
                    .featured(false)
                    .active(true)
                    .build();

            repository.saveAll(List.of(b1, b2, b3, b4, b5));
        }
    }

    @Override
    public List<BlogPostResponse> getAllActiveBlogs() {
        return repository.findByActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BlogPostResponse> getBlogsByCategory(String category) {
        return repository.findByCategoryIgnoreCaseAndActiveTrueOrderByCreatedAtDesc(category)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BlogPostResponse getBlogBySlug(String slug) {
        BlogPost post = repository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new RuntimeException("Blog post not found for slug: " + slug));
        return mapToResponse(post);
    }

    @Override
    public BlogPostResponse getFeaturedBlog() {
        List<BlogPost> featuredList = repository.findByFeaturedTrueAndActiveTrueOrderByCreatedAtDesc();
        if (!featuredList.isEmpty()) {
            return mapToResponse(featuredList.get(0));
        }
        List<BlogPost> all = repository.findByActiveTrueOrderByCreatedAtDesc();
        if (!all.isEmpty()) {
            return mapToResponse(all.get(0));
        }
        throw new RuntimeException("No active blogs found");
    }

    @Override
    public List<String> getBlogCategories() {
        return repository.findDistinctCategories();
    }

    @Override
    public List<BlogPostResponse> getAllBlogsAdmin() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BlogPostResponse createBlog(BlogPostRequest request) {
        String slug = request.getSlug();
        if (slug == null || slug.trim().isEmpty()) {
            slug = request.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        }

        BlogPost post = BlogPost.builder()
                .title(request.getTitle())
                .slug(slug)
                .category(request.getCategory())
                .content(request.getContent())
                .shortDescription(request.getShortDescription())
                .imageUrl(request.getImageUrl() != null ? request.getImageUrl() : "/media/site/blog-img-1.jpg")
                .author(request.getAuthor() != null ? request.getAuthor() : "Vinnavar Team")
                .readTimeMinutes(request.getReadTimeMinutes() != null ? request.getReadTimeMinutes() : 5)
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        return mapToResponse(repository.save(post));
    }

    @Override
    @Transactional
    public BlogPostResponse updateBlog(Long id, BlogPostRequest request) {
        BlogPost post = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));

        if (request.getTitle() != null) post.setTitle(request.getTitle());
        if (request.getCategory() != null) post.setCategory(request.getCategory());
        if (request.getContent() != null) post.setContent(request.getContent());
        if (request.getShortDescription() != null) post.setShortDescription(request.getShortDescription());
        if (request.getImageUrl() != null) post.setImageUrl(request.getImageUrl());
        if (request.getAuthor() != null) post.setAuthor(request.getAuthor());
        if (request.getReadTimeMinutes() != null) post.setReadTimeMinutes(request.getReadTimeMinutes());
        if (request.getFeatured() != null) post.setFeatured(request.getFeatured());
        if (request.getActive() != null) post.setActive(request.getActive());

        if (request.getSlug() != null && !request.getSlug().trim().isEmpty()) {
            post.setSlug(request.getSlug());
        }

        return mapToResponse(repository.save(post));
    }

    @Override
    @Transactional
    public void deleteBlog(Long id) {
        repository.deleteById(id);
    }

    private BlogPostResponse mapToResponse(BlogPost post) {
        return BlogPostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .category(post.getCategory())
                .content(post.getContent())
                .shortDescription(post.getShortDescription())
                .imageUrl(post.getImageUrl())
                .author(post.getAuthor())
                .readTimeMinutes(post.getReadTimeMinutes())
                .featured(post.getFeatured())
                .active(post.getActive())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
