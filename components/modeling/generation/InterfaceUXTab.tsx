
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import Icon from '../../shared/Icon';

interface InterfaceUXTabProps {
    wizardData: any;
}

const InterfaceUXTab: React.FC<InterfaceUXTabProps> = ({ wizardData }) => {
    // Defensive access with fallbacks
    const layoutData = wizardData?.step17 || { navigation: 'N/A', profilePosition: 'N/A', theme: 'N/A' };
    const themeData = wizardData?.step18 || { primaryColor: '#000', fontFamily: 'N/A', baseSpacing: '0', borderRadius: '0' };
    const screensData = wizardData?.step15 || { screens: [] };
    const componentsData = wizardData?.step16 || { components: {} };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Main Layout & Theme</CardTitle>
                    <CardDescription>Core structure and visual identity of the application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-sidebar/50 rounded-lg">
                            <p className="text-sm text-text-secondary">Navigation</p>
                            <p className="font-semibold">{layoutData.navigation}</p>
                        </div>
                         <div className="p-4 bg-sidebar/50 rounded-lg">
                            <p className="text-sm text-text-secondary">Profile Position</p>
                            <p className="font-semibold">{layoutData.profilePosition}</p>
                        </div>
                         <div className="p-4 bg-sidebar/50 rounded-lg">
                            <p className="text-sm text-text-secondary">Theme</p>
                            <p className="font-semibold">{layoutData.theme}</p>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-sidebar/50 rounded-lg flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full border border-card-border" style={{ backgroundColor: themeData.primaryColor }} />
                            <div>
                                <p className="text-sm text-text-secondary">Primary Color</p>
                                <p className="font-semibold">{themeData.primaryColor}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-sidebar/50 rounded-lg">
                            <p className="text-sm text-text-secondary">Font Family</p>
                            <p className="font-semibold">{themeData.fontFamily}</p>
                        </div>
                         <div className="p-4 bg-sidebar/50 rounded-lg">
                            <p className="text-sm text-text-secondary">Spacing / Radius</p>
                            <p className="font-semibold">{themeData.baseSpacing}px / {themeData.borderRadius}rem</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Screens & Components</CardTitle>
                    <CardDescription>The defined pages and the main UI components within them.</CardDescription>
                </CardHeader>
                <CardContent>
                    {(screensData.screens || []).length > 0 ? (
                         <ul className="space-y-4">
                            {screensData.screens.map((screen: any) => (
                                <li key={screen.id} className="p-4 border border-card-border rounded-lg bg-sidebar/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-accent">{screen.path}</h4>
                                            <p className="text-sm text-text-secondary">{screen.description}</p>
                                            <Badge variant="outline" className="mt-2">Layout: {screen.layout}</Badge>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-card-border/50">
                                         <h5 className="text-sm font-medium mb-2">Components:</h5>
                                         {(componentsData.components && componentsData.components[screen.id] && componentsData.components[screen.id].length > 0) ? (
                                            <div className="flex flex-wrap gap-2">
                                                {componentsData.components[screen.id].map((comp: any) => (
                                                    <Badge key={comp.id} variant="secondary">{comp.type}</Badge>
                                                ))}
                                            </div>
                                         ) : (
                                            <p className="text-xs text-text-secondary italic">No components defined for this screen.</p>
                                         )}
                                    </div>
                                </li>
                            ))}
                         </ul>
                    ) : (
                        <div className="text-center py-8 text-text-secondary">
                            <Icon name="layout" className="h-8 w-8 mx-auto mb-2" />
                            <p>No screens were defined during the modeling process.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default InterfaceUXTab;
