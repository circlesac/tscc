import config from "@piondev/shared-configs/eslint"

export default [
	{
		ignores: ["tmp/**"]
	},
	...config,
	{
		rules: {
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-empty-interface": "off"
		}
	}
]
