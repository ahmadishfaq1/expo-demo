//
//  FileSharing.m
//  jsonwidgetapp
//
//  Created by Eman Tahir on 11/10/2024.
//

#import <React/RCTBridgeModule.h>
#import "AppDelegate.h"

@interface FileSharing : NSObject <RCTBridgeModule>
@end

@implementation FileSharing

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(copyFileToSharedContainer)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [appDelegate copyFileToSharedContainer];
  });
}

@end
