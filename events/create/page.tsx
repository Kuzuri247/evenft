                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="date" className="block text-sm font-medium mb-2 text-foreground  ">
                              Date and Time*
                            </label>
                            <div className="relative">
                              <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 pl-11 border border-indigo-900/20 rounded-lg bg-background/60 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all   appearance-none"
                              />
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <div className="h-6 w-6 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                  <svg className="h-3.5 w-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <p className="mt-1.5 text-xs text-indigo-300/70  ">
                              Select the exact date and time of your event
                            </p>
                          </div>
                          
                          <div>
                            <label htmlFor="maxAttendees" className="block text-sm font-medium mb-2 text-foreground  ">
                              Max Attendees*
                            </label>
                            <input
                              type="number"
                              id="maxAttendees"
                              name="maxAttendees"
                              value={formData.maxAttendees}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-indigo-900/20 rounded-lg bg-background/60 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all   appearance-none"
                            />
                          </div>
                        </div> 