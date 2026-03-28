// SDK code generation templates for 6 languages

export type SdkLanguage = 'javascript' | 'python' | 'go' | 'ruby' | 'java' | 'rust';

interface SdkTemplate {
  language: SdkLanguage;
  label: string;
  installCommand: string;
  code: (flagKey: string, flagType: string) => string;
}

export const sdkTemplates: Record<SdkLanguage, SdkTemplate> = {
  javascript: {
    language: 'javascript',
    label: 'JavaScript',
    installCommand: 'npm install @featuregate/sdk',
    code: (flagKey: string, flagType: string) => {
      const evalMethod = flagType === 'boolean' ? 'isEnabled' : 'getValue';
      const defaultVal = flagType === 'boolean' ? 'false' : flagType === 'number' ? '0' : flagType === 'string' ? "'default'" : '{}';
      return `// 1. Installation
// npm install @featuregate/sdk
// pnpm add @featuregate/sdk

// 2. Initialization
import { FeatureGate } from '@featuregate/sdk';

const fg = new FeatureGate({
  apiKey: process.env.FEATUREGATE_API_KEY,
  environment: 'production',
});

// 3. Flag Evaluation
const result = fg.${evalMethod}('${flagKey}', {
  userId: user.id,
  attributes: {
    plan: user.plan,
    country: user.country,
  },
  defaultValue: ${defaultVal},
});

if (result) {
  // Flag is active for this user
  showNewExperience();
}

// 4. Event Tracking (for experiments)
fg.track('conversion_event', {
  userId: user.id,
  value: 49.99,
  metadata: { source: 'checkout' },
});`;
    },
  },
  python: {
    language: 'python',
    label: 'Python',
    installCommand: 'pip install featuregate',
    code: (flagKey: string, flagType: string) => {
      const evalMethod = flagType === 'boolean' ? 'is_enabled' : 'get_value';
      const defaultVal = flagType === 'boolean' ? 'False' : flagType === 'number' ? '0' : flagType === 'string' ? '"default"' : '{}';
      return `# 1. Installation
# pip install featuregate
# poetry add featuregate

# 2. Initialization
from featuregate import FeatureGate

fg = FeatureGate(
    api_key=os.environ["FEATUREGATE_API_KEY"],
    environment="production",
)

# 3. Flag Evaluation
result = fg.${evalMethod}(
    "${flagKey}",
    user_id=user.id,
    attributes={
        "plan": user.plan,
        "country": user.country,
    },
    default_value=${defaultVal},
)

if result:
    # Flag is active for this user
    show_new_experience()

# 4. Event Tracking (for experiments)
fg.track(
    "conversion_event",
    user_id=user.id,
    value=49.99,
    metadata={"source": "checkout"},
)`;
    },
  },
  go: {
    language: 'go',
    label: 'Go',
    installCommand: 'go get github.com/featuregate/go-sdk',
    code: (flagKey: string, flagType: string) => {
      const evalMethod = flagType === 'boolean' ? 'IsEnabled' : 'GetValue';
      const goType = flagType === 'boolean' ? 'bool' : flagType === 'number' ? 'float64' : 'string';
      const defaultVal = flagType === 'boolean' ? 'false' : flagType === 'number' ? '0' : '""';
      return `// 1. Installation
// go get github.com/featuregate/go-sdk

// 2. Initialization
package main

import (
    "os"
    fg "github.com/featuregate/go-sdk"
)

func main() {
    client, err := fg.NewClient(fg.Config{
        APIKey:      os.Getenv("FEATUREGATE_API_KEY"),
        Environment: "production",
    })
    if err != nil {
        log.Fatal(err)
    }
    defer client.Close()

    // 3. Flag Evaluation
    var result ${goType}
    result = client.${evalMethod}("${flagKey}", fg.EvalContext{
        UserID: user.ID,
        Attributes: map[string]interface{}{
            "plan":    user.Plan,
            "country": user.Country,
        },
        Default: ${defaultVal},
    })

    if result {
        // Flag is active for this user
        showNewExperience()
    }

    // 4. Event Tracking (for experiments)
    client.Track("conversion_event", fg.TrackEvent{
        UserID: user.ID,
        Value:  49.99,
        Metadata: map[string]string{
            "source": "checkout",
        },
    })
}`;
    },
  },
  ruby: {
    language: 'ruby',
    label: 'Ruby',
    installCommand: 'gem install featuregate',
    code: (flagKey: string, flagType: string) => {
      const evalMethod = flagType === 'boolean' ? 'enabled?' : 'get_value';
      const defaultVal = flagType === 'boolean' ? 'false' : flagType === 'number' ? '0' : flagType === 'string' ? '"default"' : '{}';
      return `# 1. Installation
# gem install featuregate
# Or add to Gemfile: gem 'featuregate'

# 2. Initialization
require 'featuregate'

fg = FeatureGate::Client.new(
  api_key: ENV['FEATUREGATE_API_KEY'],
  environment: 'production'
)

# 3. Flag Evaluation
result = fg.${evalMethod}(
  '${flagKey}',
  user_id: user.id,
  attributes: {
    plan: user.plan,
    country: user.country
  },
  default_value: ${defaultVal}
)

if result
  # Flag is active for this user
  show_new_experience
end

# 4. Event Tracking (for experiments)
fg.track(
  'conversion_event',
  user_id: user.id,
  value: 49.99,
  metadata: { source: 'checkout' }
)`;
    },
  },
  java: {
    language: 'java',
    label: 'Java',
    installCommand: 'implementation "com.featuregate:sdk:1.0.0"',
    code: (flagKey: string, flagType: string) => {
      const evalMethod = flagType === 'boolean' ? 'isEnabled' : 'getValue';
      const javaType = flagType === 'boolean' ? 'boolean' : flagType === 'number' ? 'double' : 'String';
      const defaultVal = flagType === 'boolean' ? 'false' : flagType === 'number' ? '0.0' : '""';
      return `// 1. Installation (Gradle)
// implementation "com.featuregate:sdk:1.0.0"
// Maven: <dependency>
//   <groupId>com.featuregate</groupId>
//   <artifactId>sdk</artifactId>
//   <version>1.0.0</version>
// </dependency>

// 2. Initialization
import com.featuregate.FeatureGate;
import com.featuregate.EvalContext;

FeatureGate fg = FeatureGate.builder()
    .apiKey(System.getenv("FEATUREGATE_API_KEY"))
    .environment("production")
    .build();

// 3. Flag Evaluation
${javaType} result = fg.${evalMethod}("${flagKey}",
    EvalContext.builder()
        .userId(user.getId())
        .attribute("plan", user.getPlan())
        .attribute("country", user.getCountry())
        .defaultValue(${defaultVal})
        .build());

if (result) {
    // Flag is active for this user
    showNewExperience();
}

// 4. Event Tracking (for experiments)
fg.track("conversion_event",
    TrackEvent.builder()
        .userId(user.getId())
        .value(49.99)
        .metadata(Map.of("source", "checkout"))
        .build());`;
    },
  },
  rust: {
    language: 'rust',
    label: 'Rust',
    installCommand: 'cargo add featuregate',
    code: (flagKey: string, flagType: string) => {
      const evalMethod = flagType === 'boolean' ? 'is_enabled' : 'get_value';
      const rustType = flagType === 'boolean' ? 'bool' : flagType === 'number' ? 'f64' : flagType === 'string' ? 'String' : 'serde_json::Value';
      const defaultVal = flagType === 'boolean' ? 'false' : flagType === 'number' ? '0.0' : flagType === 'string' ? 'String::from("default")' : 'serde_json::json!({})';
      return `// 1. Installation
// cargo add featuregate
// Or in Cargo.toml: featuregate = "1.0"

// 2. Initialization
use featuregate::{FeatureGate, EvalContext, TrackEvent};
use std::collections::HashMap;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let fg = FeatureGate::builder()
        .api_key(std::env::var("FEATUREGATE_API_KEY")?)
        .environment("production")
        .build()
        .await?;

    // 3. Flag Evaluation
    let result: ${rustType} = fg.${evalMethod}(
        "${flagKey}",
        EvalContext::builder()
            .user_id(&user.id)
            .attribute("plan", &user.plan)
            .attribute("country", &user.country)
            .default_value(${defaultVal})
            .build(),
    ).await?;

    if result {
        // Flag is active for this user
        show_new_experience();
    }

    // 4. Event Tracking (for experiments)
    fg.track(TrackEvent::new("conversion_event")
        .user_id(&user.id)
        .value(49.99)
        .metadata(HashMap::from([("source", "checkout")]))
    ).await?;

    Ok(())
}`;
    },
  },
};

export const sdkLanguageOrder: SdkLanguage[] = ['javascript', 'python', 'go', 'ruby', 'java', 'rust'];
