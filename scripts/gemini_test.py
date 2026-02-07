import google.generativeai as genai

# ❌ For testing only. Do NOT hard-code keys in real projects.
API_KEY = "AIzaSyCPx3F2FqG7J3n0D4IrlS2eYZsPLxg3Q5o"

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-flash-latest")

response = model.generate_content("Explain HDBSCAN in one paragraph.")

print(response.text)