            {nfts.map((nft) => {
              const preview = getNFTPreview(nft);
              return (
                <div key={nft.mint} className="bg-card rounded-lg shadow-sm overflow-hidden border border-border hover:border-indigo-600/50 transition-colors group">
                  <div className="relative h-48 w-full bg-background/50">
                    {preview.image ? (
                      <Image 
                        src={preview.image} 
                        alt={preview.name}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-1 truncate" title={preview.name}>
                      {preview.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 h-10" title={preview.description}>
                      {preview.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-muted-foreground truncate">
                        Mint: {nft.mint.slice(0, 6)}...{nft.mint.slice(-4)}
                      </p>
                      <a 
                        href={`https://explorer.solana.com/address/${nft.mint}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group-hover:text-indigo-400 text-indigo-600/80 text-xs flex items-center transition-colors"
                      >
                        <span>View on Explorer</span>
                        <svg className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })} 