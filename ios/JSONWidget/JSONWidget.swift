import WidgetKit
import SwiftUI
import Foundation

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), content: "File not found", count: 0)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) {
        let entry = SimpleEntry(date: Date(), content: "File not found", count: 0)
        completion(entry)
    }
  func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> Void) {
          var entries: [SimpleEntry] = []
          
          // Fetch the content from the shared app group directory
          guard let sharedContainerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.com.app.test.test") else {
              print("Failed to get shared container URL")
              completion(Timeline(entries: [SimpleEntry(date: Date(), content: "Error: No shared container", count: 0)], policy: .atEnd))
              return
          }
          
          let fileUrl = sharedContainerURL.appendingPathComponent("x.json")
          print("Attempting to read file from: \(fileUrl.path)")

          // Check if the file exists and read its content
          let initialContent: String
          if let data = try? Data(contentsOf: fileUrl), let json = try? JSONDecoder().decode([String: String].self, from: data) {
              initialContent = json["message"] ?? "File not found"
          } else {
              initialContent = "File not found"
          }

          // Create entries for 60 seconds
          for i in 0..<60 {
              let entryDate = Date().addingTimeInterval(Double(i)) // Increment date by seconds
              let entry = SimpleEntry(date: entryDate, content: initialContent, count: i)
              entries.append(entry)
          }

          // Schedule the next update after 1 minute
          let nextUpdateDate = Date().addingTimeInterval(60) // Update every minute
          let timeline = Timeline(entries: entries, policy: .after(nextUpdateDate))
          completion(timeline)
      }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let content: String
    let count: Int
}

struct JSONWidgetEntryView: View {
    var entry: Provider.Entry

    var body: some View {
        VStack {
            Text(entry.content)
            Text("Count: \(entry.count)")
        }
    }
}

struct JSONWidget: Widget {
    let kind: String = "JSONWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            JSONWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("JSON Widget")
        .description("This widget shows the content of x.json.")
    }
}
