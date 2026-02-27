# X (Twitter) Agent - Complete Documentation

## Purpose
Monitor ecosystem social activity, detect launches, track engagement, and provide real-time community insights.

## Data Collection

### Monitored Entities
- All founder Twitter accounts (from project database)
- @BaseIndiaCircle official account
- Project mention keywords
- Hashtags: #BaseIndia #BuildOnBase #BaseBatch

### Collection Method
```typescript
// Real-time via webhooks (preferred)
// Fallback: Poll every 5 minutes
// Rate limit: 100 requests per 15 min window

interface XActivity {
  type: 'launch' | 'update' | 'milestone' | 'thread' | 'media';
  author: string;
  projectMentioned?: string;
  content: string;
  engagement: {
    likes: number;
    retweets: number;
    replies: number;
    impressions: number;
  };
  timestamp: string;
  url: string;
}
```

## Processing Pipeline

### 1. Entity Extraction (AI-Powered)
```typescript
// Uses GPT-4 to extract structured data
Input: "Just deployed PayBase v2 with USDC support on Base! 🚀"

Output: {
  founder: "Satyam Singhal",
  project: "PayBase",
  eventType: "deployment",
  features: ["USDC", "payments"],
  sentiment: 0.92,  // Very positive
  keywords: ["deployed", "v2", "USDC", "Base"]
}
```

### 2. Relevance Scoring Algorithm
```typescript
function scoreRelevance(tweet: Tweet): number {
  let score = 0;
  
  // Known founder (30 points)
  if (isFounderInDatabase(tweet.author)) score += 30;
  
  // Project mention (25 points)
  if (mentionsKnownProject(tweet.text)) score += 25;
  
  // Engagement (up to 20 points)
  const engagementScore = Math.min(
    Math.log(tweet.likes + tweet.retweets + 1) * 2,
    20
  );
  score += engagementScore;
  
  // Base keywords (15 points)
  if (containsKeywords(tweet.text, ['Base', 'onchain', 'deployed'])) {
    score += 15;
  }
  
  // Media/demo (10 points)
  if (tweet.media?.length > 0 || tweet.hasVideo) score += 10;
  
  return Math.min(score, 100);
}
```

### 3. AI Summarization
```typescript
// Condense complex threads into digestible summaries
Input: 15-tweet thread about smart contract architecture

Output: "PayBase launched their USDC payment gateway on Base, 
enabling merchants to accept crypto payments with instant INR 
settlements. Contract verified at 0x123...abc on BaseScan."
```

### 4. Database Storage
```sql
INSERT INTO agent_activities (
  agent_type,
  activity_type,
  project_id,
  founder_id,
  raw_data,
  processed_summary,
  relevance_score,
  sentiment_score,
  created_at
) VALUES (
  'x',
  'launch',
  'paybase-uuid',
  'satyam-twitter',
  '{"tweet_id": "123", "full_text": "...", "metrics": {...}}',
  'PayBase launched USDC gateway...',
  87.5,
  0.92,
  NOW()
);
```

## Features Powered by X Agent

### 1. Launch Radar
**Purpose**: Auto-detect product launches

**Detection Keywords**:
- launched, live, shipping, announcing, released
- deployed, went live, now available
- introducing, unveiling

**Workflow**:
```typescript
async function handleLaunchDetection(activity: XActivity) {
  // 1. Validate it's a real launch
  const isValid = await validateLaunch(activity);
  if (!isValid) return;
  
  // 2. Create homepage banner
  await createBanner({
    type: 'launch',
    project: activity.project,
    duration: 24 * 60 * 60 * 1000,  // 24 hours
    message: activity.summary
  });
  
  // 3. Send push notifications
  await notifySubscribers({
    title: `${activity.project} just launched!`,
    body: activity.summary,
    url: activity.projectUrl
  });
  
  // 4. Repost from @BaseIndiaCircle
  await repostOnX({
    originalTweetId: activity.tweetId,
    quote: `🎉 Another builder shipping on Base!`
  });
}
```

### 2. Builder Spotlight
**Purpose**: Surface interesting technical content

**Selection Criteria**:
- Relevance score > 80
- Thread length > 5 tweets
- Contains technical keywords
- High engagement ratio

**Auto-Curation**:
```typescript
interface Spotlight {
  founder: string;
  thread: Tweet[];
  topic: string;
  keyTakeaways: string[];
  estimatedReadTime: number;
  featured: boolean;
}

// Weekly newsletter section
// Homepage "Builder Spotlight" widget
```

### 3. Community Pulse Dashboard
**Real-time ecosystem sentiment and trends**

```typescript
interface CommunityPulse {
  // Updated every hour
  trendingTopics: Array<{
    topic: string;
    mentions: number;
    sentiment: number;
    change24h: number;  // % increase
  }>;
  
  // Overall ecosystem sentiment
  sentiment: {
    score: number;        // -1 to 1
    trend: 'rising' | 'stable' | 'declining';
    breakdown: {
      positive: number;   // %
      neutral: number;
      negative: number;
    }
  };
  
  // Most active builders
  topEngagers: Array<{
    founder: string;
    tweets: number;
    engagement: number;
    topPost: Tweet;
  }>;
  
  // Viral content
  viralPosts: Array<{
    tweet: Tweet;
    viralityScore: number;  // engagement / followers
    reach: number;           // estimated impressions
  }>;
  
  // Growth metrics
  weeklyGrowth: {
    newProjects: number;
    totalMentions: number;
    uniqueEngagers: number;
    change: number;  // % vs last week
  }
}
```

### 4. X Activity Feed Widget
**Live feed on project pages**

```typescript
// Real-time updates via WebSocket
interface ProjectXFeed {
  projectId: string;
  recentTweets: Tweet[];      // Last 5
  totalMentions: number;
  weeklyImpressions: number;
  topPost: Tweet;             // Highest engagement
  sentiment: number;
}
```

**Display**:
- Latest 5 tweets mentioning project
- Engagement metrics
- Sentiment indicator
- "View all on X" link

### 5. Engagement Metrics
**Shown on project cards and detail pages**

```typescript
interface EngagementMetrics {
  period: '24h' | '7d' | '30d';
  
  metrics: {
    totalMentions: number;
    uniqueEngagers: number;
    totalImpressions: number;
    averageEngagement: number;
    sentimentScore: number;
    viralityScore: number;
  };
  
  trends: {
    mentionsChange: number;      // %
    engagementChange: number;
    sentimentChange: number;
  };
  
  topPosts: Tweet[];
  
  distribution: {
    byType: Record<TweetType, number>;
    byTime: Record<HourOfDay, number>;
    byEngagement: {
      low: number;
      medium: number;
      high: number;
      viral: number;
    }
  }
}
```

### 6. Auto-Response Bot
**Smart community engagement**

**Capabilities**:
```typescript
interface BotCapabilities {
  // FAQ answering
  faqs: Array<{
    question: string;
    answer: string;
    triggers: string[];
  }>;
  
  // Project recommendations
  recommend: (query: string) => Project[];
  
  // Welcome new builders
  welcomeMessage: (user: TwitterUser) => string;
  
  // Smart handoff to humans
  needsHuman: (message: string) => boolean;
}
```

**Example Interactions**:
```
User: "How do I submit my project?"
Bot: "👋 You can submit your project here: [link]
     We verify onchain activity and builder identity. 
     Takes 2-3 days. Need help? DM us!"

User: "What DeFi projects are on Base India?"
Bot: "We have 5 DeFi projects! Check out:
     • PayBase - USDC payments
     • YieldFarm - Staking protocol
     • SwapBase - DEX
     Full list: [link]"
```

### 7. Trending Alerts
**Notify when project goes viral**

```typescript
interface TrendingAlert {
  projectId: string;
  trigger: 'viral_tweet' | 'mention_spike' | 'sentiment_surge';
  
  viral_tweet?: {
    tweetId: string;
    engagement: number;
    viralityScore: number;  // > 10x normal
  };
  
  mention_spike?: {
    current: number;
    baseline: number;
    increase: number;  // %
  };
  
  sentiment_surge?: {
    before: number;
    after: number;
    positiveShift: number;
  };
  
  action: 'notify_founder' | 'feature_on_homepage' | 'amplify';
}
```

## Data Storage Schema

```sql
-- Main activity table
CREATE TABLE x_activities (
  id UUID PRIMARY KEY,
  tweet_id VARCHAR(255) UNIQUE,
  author_twitter VARCHAR(255),
  project_id UUID,
  founder_id UUID,
  
  content TEXT,
  tweet_type VARCHAR(50),
  
  engagement JSONB,  -- likes, retweets, replies, impressions
  sentiment_score FLOAT,
  relevance_score FLOAT,
  
  processed_summary TEXT,
  entities JSONB,  -- extracted entities
  
  created_at TIMESTAMP,
  collected_at TIMESTAMP,
  
  INDEX idx_project (project_id),
  INDEX idx_founder (founder_id),
  INDEX idx_relevance (relevance_score DESC),
  INDEX idx_created (created_at DESC)
);

-- Trending topics cache
CREATE TABLE x_trending (
  id UUID PRIMARY KEY,
  topic VARCHAR(255),
  mention_count INT,
  sentiment FLOAT,
  period VARCHAR(10),  -- '1h', '24h', '7d'
  expires_at TIMESTAMP,
  created_at TIMESTAMP
);

-- Engagement metrics cache
CREATE TABLE x_engagement_cache (
  project_id UUID PRIMARY KEY,
  period VARCHAR(10),
  metrics JSONB,
  updated_at TIMESTAMP
);
```

## API Endpoints

```typescript
// Get project X activity
GET /api/agent/x/project/:id
Response: {
  recentTweets: Tweet[];
  metrics: EngagementMetrics;
  sentiment: number;
}

// Get community pulse
GET /api/agent/x/pulse
Response: CommunityPulse;

// Get trending topics
GET /api/agent/x/trending?period=24h
Response: {
  topics: TrendingTopic[];
  updated: string;
}

// Search X activity
GET /api/agent/x/search?q=paybase&limit=20
Response: {
  results: XActivity[];
  total: number;
}
```

## Configuration

```typescript
// Agent config
const X_AGENT_CONFIG = {
  pollInterval: 5 * 60 * 1000,  // 5 minutes
  batchSize: 100,                // tweets per batch
  maxRetries: 3,
  timeout: 30000,                // 30 seconds
  
  relevanceThreshold: 60,        // minimum score to store
  
  webhooks: {
    enabled: true,
    secret: process.env.X_WEBHOOK_SECRET,
    events: ['tweet.create', 'tweet.delete']
  },
  
  ai: {
    model: 'gpt-4-turbo',
    temperature: 0.3,
    maxTokens: 500
  }
};
```

## Cost Estimation

```
X API Basic Tier: $100/month
OpenAI GPT-4 API: ~$300/month (for summarization)
Database: ~$25/month (PostgreSQL)
Total: ~$425/month
```
