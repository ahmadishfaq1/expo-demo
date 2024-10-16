//
//  JSONWidgetBundle.swift
//  JSONWidget
//
//  Created by Eman Tahir on 11/10/2024.
//

import WidgetKit
import SwiftUI

@main
struct JSONWidgetBundle: WidgetBundle {
    var body: some Widget {
        JSONWidget()
        JSONWidgetControl()
        JSONWidgetLiveActivity()
    }
}
