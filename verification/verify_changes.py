import time
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # 1. Login to Admin
            print("Navigating to Login...")
            page.goto("http://localhost:3000/login")
            page.fill("input[type='text']", "admin")
            page.fill("input[type='password']", "admin123")
            page.click("button[type='submit']")

            # Wait for dashboard
            print("Waiting for Dashboard...")
            expect(page.get_by_text("Dashboard Overview")).to_be_visible(timeout=10000)

            # 2. Go to Tour Form
            print("Navigating to New Tour Form...")
            page.goto("http://localhost:3000/admin/tours/new")

            # Verify Destination Section
            print("Verifying Destinations Section...")
            expect(page.get_by_text("Destinations (with Images)")).to_be_visible()
            # Verify Activity Section
            expect(page.get_by_text("Activities (with Images)")).to_be_visible()

            # Take screenshot of Tour Form
            page.screenshot(path="verification/tour_form_verification.png", full_page=True)
            print("Tour Form verification screenshot saved.")

            # 3. Verify Settings Page
            print("Navigating to Settings...")
            page.goto("http://localhost:3000/admin/settings")
            expect(page.get_by_text("Social Media Links")).to_be_visible()
            expect(page.get_by_text("WhatsApp Number")).to_be_visible()

            # 4. Verify Home Page WhatsApp Bubble
            print("Navigating to Home...")
            page.goto("http://localhost:3000/")

            # Wait a bit for data to load
            time.sleep(2)

            whatsapp_link = page.get_by_label("Chat on WhatsApp")
            expect(whatsapp_link).to_be_visible()
            print("WhatsApp bubble found.")

            # Take screenshot of Home
            page.screenshot(path="verification/home_verification.png")
            print("Home verification screenshot saved.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    run()
