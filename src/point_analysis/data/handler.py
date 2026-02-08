import logging
from pathlib import Path
from typing import Any, Optional, Union, Callable, Dict

import pandas as pd
import matplotlib.pyplot as plt
import joblib

from point_analysis.core.settings import settings

logger = logging.getLogger(__name__)


class DataHandler:
    """
    Centralized I/O handler for tabular data, serialized objects, and plots.

    Supported formats:
    - csv, parquet, excel/xlsx, json
    - pkl, joblib
    """

    # --------------------------------------------------
    # I/O registries (easy to extend)
    # --------------------------------------------------

    _LOADERS: Dict[str, Callable[..., Any]] = {
        "csv": pd.read_csv,
        "parquet": pd.read_parquet,
        "xlsx": pd.read_excel,
        "excel": pd.read_excel,
        "json": pd.read_json,
        "pkl": joblib.load,
        "joblib": joblib.load,
    }

    _SAVERS: Dict[str, Callable[..., None]] = {
        "csv": lambda obj, path, **kw: obj.to_csv(path, **kw),
        "parquet": lambda obj, path, **kw: obj.to_parquet(path, **kw),
        "xlsx": lambda obj, path, **kw: obj.to_excel(path, **kw),
        "excel": lambda obj, path, **kw: obj.to_excel(path, **kw),
        "json": lambda obj, path, **kw: obj.to_json(path, **kw),
        "pkl": lambda obj, path, **_: joblib.dump(obj, path),
        "joblib": lambda obj, path, **_: joblib.dump(obj, path),
    }

    # --------------------------------------------------
    # Init
    # --------------------------------------------------

    def __init__(
        self,
        filepath: Union[str, Path],
        file_type: Optional[str] = None,
        **kwargs,
    ):
        self.filepath = Path(filepath)
        self.file_type = (
            file_type.lower()
            if file_type
            else self.filepath.suffix.lstrip(".").lower()
        )
        self.kwargs = kwargs

        if self.file_type not in self._LOADERS:
            raise ValueError(f"Unsupported file type: {self.file_type}")

    # --------------------------------------------------
    # Load
    # --------------------------------------------------

    def load(self) -> Any:
        """Load data or object from disk."""
        try:
            loader = self._LOADERS[self.file_type]
            logger.debug(f"Loading {self.file_type} from {self.filepath}")
            return loader(self.filepath, **self.kwargs)

        except Exception as e:
            logger.exception(f"Load failed: {self.filepath}")
            raise RuntimeError(
                f"Failed to load {self.file_type} file at {self.filepath}"
            ) from e

    # --------------------------------------------------
    # Save
    # --------------------------------------------------

    def save(self, obj: Any):
        """Save a DataFrame or Python object to disk."""
        self.filepath.parent.mkdir(parents=True, exist_ok=True)

        try:
            saver = self._SAVERS[self.file_type]

            if self.file_type in {"csv", "xlsx", "excel"}:
                self.kwargs.setdefault("index", False)

            logger.debug(f"Saving {self.file_type} to {self.filepath}")
            saver(obj, self.filepath, **self.kwargs)

            logger.info(f"Saved successfully: {self.filepath}")

        except Exception as e:
            logger.exception(f"Save failed: {self.filepath}")
            raise RuntimeError(
                f"Failed to save {self.file_type} file at {self.filepath}"
            ) from e

    # --------------------------------------------------
    # Registry Factory
    # --------------------------------------------------

    @classmethod
    def from_registry(
        cls,
        section: str,
        path_key: str,
        filename: str,
        **kwargs,
    ) -> "DataHandler":
        """
        Build handler using paths from settings.

        Example:
            DataHandler.from_registry(
                section="models",
                path_key="models_dir",
                filename="best_model.pkl"
            )
        """
        try:
            registry = getattr(settings.paths, section.upper())
            base_path = registry[path_key]
            return cls(base_path / filename, **kwargs)

        except Exception as e:
            logger.exception(
                f"Registry lookup failed: section={section}, key={path_key}"
            )
            raise RuntimeError(
                f"Invalid registry path: {section}.{path_key}"
            ) from e

    # --------------------------------------------------
    # Plot Saving
    # --------------------------------------------------

    @staticmethod
    def save_plot(
        filename: str,
        fig: Optional[plt.Figure] = None,
        **kwargs,
    ) -> Path:
        """Save matplotlib figure to reports/plots directory."""
        plot_dir = settings.paths.REPORTS["plots_dir"]
        plot_dir.mkdir(parents=True, exist_ok=True)

        save_path = plot_dir / filename

        try:
            target = fig if fig else plt
            target.savefig(save_path, bbox_inches="tight", **kwargs)

            logger.info(f"Plot saved: {save_path}")
            return save_path

        except Exception as e:
            logger.exception(f"Plot save failed: {filename}")
            raise RuntimeError(
                f"Failed to save plot: {filename}"
            ) from e
