module.exports = {
    testRunner: {
        args: {
            '$0': 'jest',
            config: 'e2e/jest.config.js'
        },
        jest: {
            setupTimeout: 120000
        }
    },
    apps: {
        'ios.debug': {
            type: 'ios.app',
            binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/SickleSafe.app',
            build: 'xcodebuild -workspace ios/sicklesafe.xcworkspace -scheme SickleSafe -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
        }
    },
    devices: {
        simulator: {
            type: 'ios.simulator',
            device: {
                type: 'iPhone 15 Pro'
            }
        }
    },
    configurations: {
        'ios.sim.debug': {
            device: 'simulator',
            app: 'ios.debug'
        }
    }
};
