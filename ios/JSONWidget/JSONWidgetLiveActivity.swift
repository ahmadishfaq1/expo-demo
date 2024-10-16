//
//  JSONWidgetLiveActivity.swift
//  JSONWidget
//
//  Created by Eman Tahir on 11/10/2024.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct JSONWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct JSONWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: JSONWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension JSONWidgetAttributes {
    fileprivate static var preview: JSONWidgetAttributes {
        JSONWidgetAttributes(name: "World")
    }
}

extension JSONWidgetAttributes.ContentState {
    fileprivate static var smiley: JSONWidgetAttributes.ContentState {
        JSONWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: JSONWidgetAttributes.ContentState {
         JSONWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: JSONWidgetAttributes.preview) {
   JSONWidgetLiveActivity()
} contentStates: {
    JSONWidgetAttributes.ContentState.smiley
    JSONWidgetAttributes.ContentState.starEyes
}
