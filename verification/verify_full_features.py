from playwright.sync_api import sync_playwright, expect
import os

BASE_URL = "http://localhost:3003"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            print("Step 1: Login")
            page.goto(f'{BASE_URL}/login')
            page.fill('input[type="text"]', 'admin')
            page.fill('input[type="password"]', 'admin123')
            page.click('button[type="submit"]')
            page.wait_for_url('**/admin')
            print("Login successful")

            print("Step 2: Update Settings")
            page.goto(f'{BASE_URL}/admin/settings')
            # Update WhatsApp
            page.fill('input[name="whatsapp"]', '94779998888')
            page.click('button:has-text("Save Changes")')
            page.wait_for_selector('text=Settings updated successfully')
            print("Settings updated")

            print("Step 3: Create Tour")
            page.goto(f'{BASE_URL}/admin/tours/new')

            # Basic Info
            page.fill('input[name="title"]', 'Verification Tour')
            page.fill('input[name="location"]', 'Test Location')
            page.select_option('select[name="category"]', 'Adventure')
            page.fill('input[name="price"]', '500')
            page.fill('input[name="days"]', '3')
            page.fill('input[name="nights"]', '2')
            page.fill('textarea[name="description"]', 'This is a test tour for verification.')

            # Image Upload (Main)
            file_input = page.locator('input[type="file"]').first
            file_input.set_input_files('assets/logo.png')
            page.wait_for_timeout(2000)

            # Destinations
            page.click('button:has-text("+ Add Destination")')
            dest_inputs = page.locator('input[placeholder="Name"]')
            dest_inputs.last.fill('Test Destination 1')

            # Activities
            page.click('button:has-text("+ Add Activity")')
            act_inputs = page.locator('input[placeholder="Name"]')
            act_inputs.last.fill('Test Activity 1')

            # Itinerary
            page.click('button:has-text("+ Add Day")')
            itinerary_title_inputs = page.locator('input[placeholder="Title (e.g., Arrival in Colombo)"]')
            itinerary_title_inputs.last.fill('Day 1 Arrival')

            page.click('button:has-text("Create Tour")')
            page.wait_for_url('**/admin/tours')
            print("Tour created")

            print("Step 4: Verify Public Site")
            page.goto(f'{BASE_URL}/')

            # Check WhatsApp Bubble
            bubble = page.locator('a[href*="wa.me/94779998888"]')
            expect(bubble).to_be_visible()
            print("WhatsApp bubble verified")

            # Check Tour List
            page.goto(f'{BASE_URL}/tours')

            # Find the card with the specific title
            card = page.locator('.group', has_text='Verification Tour').first
            expect(card).to_be_visible()

            # Click View Details inside that card
            card.locator('text=View Details').click()

            # Verify Detail Page
            page.wait_for_selector('h1:text("Verification Tour")')
            print(f"Navigated to: {page.url}")

            # Check Tabs/Content
            expect(page.locator('text=Test Destination 1')).to_be_hidden()

            # Click Destinations Tab
            page.click('button:has-text("Destinations")')
            expect(page.locator('text=Test Destination 1')).to_be_visible()

            # Click Itinerary Tab
            page.click('button:has-text("Itinerary")')
            expect(page.locator('text=Day 1 Arrival')).to_be_visible()

            print("Tour Details verified")

            page.screenshot(path='verification/full_feature_verification.png', full_page=True)

            print("Step 5: Cleanup (Delete Tour)")
            page.goto(f'{BASE_URL}/admin/tours')

            # Handle multiple tours with same name, delete all of them
            while True:
                row = page.locator('tr', has_text='Verification Tour').first
                if row.is_visible():
                    print("Deleting a test tour...")
                    # Set up dialog handler
                    page.on('dialog', lambda dialog: dialog.accept())

                    # Click delete button in that row
                    row.locator('button').click()
                    page.wait_for_timeout(1000) # Wait for deletion
                else:
                    break

            print("Cleanup Complete")
            print("Verification Complete")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path='verification/error_full.png')
            raise e
        finally:
            browser.close()

if __name__ == '__main__':
    run()
