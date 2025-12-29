describe('Sickle Cell Type Screen - Keyboard Test', () => {
    beforeAll(async () => {
        await device.launchApp({
            newInstance: true,
            permissions: { notifications: 'YES' }
        });
    });

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('should show keyboard and input field properly when adding custom type', async () => {
        // Navigate through onboarding to reach the sickle cell type screen
        // This assumes we start at the welcome screen

        // Take initial screenshot
        await device.takeScreenshot('01-initial-screen');

        // Try to find and tap the "Add Other Type" button
        try {
            const addButton = element(by.text('Add Other Type'));
            await addButton.tap();

            // Wait a moment for keyboard to appear
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Take screenshot with keyboard visible
            await device.takeScreenshot('02-keyboard-appeared');

            // Try to type in the input
            const input = element(by.label('Other Type'));
            await input.typeText('HbS Test');

            // Take screenshot after typing
            await device.takeScreenshot('03-after-typing');

            // Scroll if needed to see buttons
            await element(by.id('scrollView')).scrollTo('bottom');

            // Take final screenshot
            await device.takeScreenshot('04-scrolled-view');

        } catch (error) {
            console.log('Test error:', error);
            await device.takeScreenshot('error-state');
            throw error;
        }
    });
});
