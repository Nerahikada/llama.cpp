import type { RecommendedMCPServer } from '$lib/types';

// Suggested MCP servers shown as opt-in cards in the "Add New Server" dialog.
// Rendering these cards never reaches the upstream domain - favicons come
// from local bundles in static/recommended-mcp/ and the URL is only used
// after the user clicks Add.
export const RECOMMENDED_MCP_SERVERS: RecommendedMCPServer[] = [
	{
		description: 'Web を検索し、ページ全文をクリーンな Markdown として取得します。',
		iconUrl: '/recommended-mcp/exa.ico',
		id: 'exa',
		name: 'Exa',
		url: 'https://mcp.exa.ai/mcp'
	},
	{
		description: 'Hugging Face Hub 上の AI モデル、データセット、スペース、ドキュメントを検索・閲覧します。',
		iconUrl: '/recommended-mcp/huggingface.ico',
		id: 'huggingface',
		name: 'Hugging Face',
		url: 'https://huggingface.co/mcp'
	},
	{
		description: 'GitHub のリポジトリ、Issue、プルリクエストを検索し、コードを操作します。',
		iconUrlDark: '/recommended-mcp/github-dark.png',
		iconUrlLight: '/recommended-mcp/github-light.png',
		id: 'github',
		name: 'GitHub',
		needsAuthorization: true,
		url: 'https://api.githubcopilot.com/mcp'
	},
	{
		description: 'ライブラリやフレームワークの最新ドキュメントとコード例を閲覧します。',
		iconUrl: '/recommended-mcp/context7.png',
		id: 'context7',
		name: 'Context7',
		url: 'https://mcp.context7.com/mcp'
	}
];
