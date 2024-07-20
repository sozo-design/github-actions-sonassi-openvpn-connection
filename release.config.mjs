/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
    "branches": [
        "main",
        {
            "name": "beta",
            "prerelease": true
        },
        {
            "name": "alpha",
            "prerelease": true
        }
    ],
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        [
            "@semantic-release/github",
        ],
        [
            "@semantic-release/npm",
            {
                "npmPublish": false
            }
        ]
    ]
};